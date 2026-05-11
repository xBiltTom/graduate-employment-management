import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  EstadoOferta,
  EstadoPostulacion,
  ModalidadOferta,
  Prisma,
} from '@graduate-employment-management/database';
import {
  buildPaginationMeta,
  normalizePagination,
  runPaginatedReadQueries,
} from '../common/utils/pagination.util';
import { PrismaService } from '../prisma/prisma.service';
import {
  AdminContratacionPorCohorteInput,
  AdminDemandaHabilidadesInput,
  AdminEgresadosPorCarreraInput,
  AdminKpisInput,
  AdminOfertasVsPostulacionesInput,
  AdminPostulacionesPorEstadoInput,
  DateRangeInput,
  EgresadoRecomendacionesBasicasInput,
  EmpresaEmbudoPostulantesInput,
  EmpresaRendimientoOfertasInput,
  EmpresaResumenInput,
  EstadoPostulacionCount,
} from './schemas/estadisticas.schemas';

const ESTADO_FLOW: EstadoPostulacion[] = [
  EstadoPostulacion.POSTULADO,
  EstadoPostulacion.EN_REVISION,
  EstadoPostulacion.ENTREVISTA,
  EstadoPostulacion.CONTRATADO,
  EstadoPostulacion.RECHAZADO,
];

@Injectable()
export class EstadisticasService {
  constructor(private readonly prisma: PrismaService) {}

  async adminKPIs(input: AdminKpisInput) {
    this.assertValidDateRange(input.fechaDesde, input.fechaHasta);
    const egresadoWhere = this.buildEgresadoWhereFromFilters(input);
    const empresaWhere = this.buildEmpresaWhereFromFilters(input);
    const ofertaWhere = this.buildOfertaWhereFromFilters(input);
    const postulacionWhere = this.buildPostulacionWhereFromFilters(input);
    const contratacionWhere = {
      ...postulacionWhere,
      estado: EstadoPostulacion.CONTRATADO,
    } satisfies Prisma.PostulacionWhereInput;

    const [
      totalEgresados,
      totalEmpresas,
      empresasAprobadas,
      ofertasActivas,
      totalPostulaciones,
      contrataciones,
      egresadosContratados,
    ] = await Promise.all([
      this.prisma.egresado.count({ where: egresadoWhere }),
      this.prisma.empresa.count({ where: empresaWhere }),
      this.prisma.empresa.count({
        where: {
          ...empresaWhere,
          estadoValidacion: 'APROBADA',
        },
      }),
      this.prisma.ofertaLaboral.count({
        where: {
          ...ofertaWhere,
          estado: EstadoOferta.ACTIVA,
        },
      }),
      this.prisma.postulacion.count({ where: postulacionWhere }),
      this.prisma.postulacion.count({ where: contratacionWhere }),
      this.prisma.postulacion.findMany({
        where: contratacionWhere,
        distinct: ['egresadoId'],
        select: {
          egresadoId: true,
        },
      }),
    ]);

    return {
      totalEgresados,
      totalEmpresas,
      empresasAprobadas,
      ofertasActivas,
      totalPostulaciones,
      contrataciones,
      tasaContratacion: this.percentage(contrataciones, totalPostulaciones),
      tasaEmpleabilidad: this.percentage(
        egresadosContratados.length,
        totalEgresados,
      ),
    };
  }

  async adminOfertasVsPostulaciones(input: AdminOfertasVsPostulacionesInput) {
    this.assertValidDateRange(input.fechaDesde, input.fechaHasta);

    const [ofertas, postulaciones] = await Promise.all([
      this.prisma.ofertaLaboral.findMany({
        where: this.buildOfertaWhereFromFilters(input),
        select: {
          publicadoEn: true,
          creadoEn: true,
        },
      }),
      this.prisma.postulacion.findMany({
        where: this.buildPostulacionWhereFromFilters(input),
        select: {
          postuladoEn: true,
        },
      }),
    ]);

    const series = new Map<
      string,
      { periodo: string; ofertas: number; postulaciones: number }
    >();

    for (const oferta of ofertas) {
      const periodo = this.monthKey(oferta.publicadoEn ?? oferta.creadoEn);
      const current = series.get(periodo) ?? {
        periodo,
        ofertas: 0,
        postulaciones: 0,
      };
      current.ofertas += 1;
      series.set(periodo, current);
    }

    for (const postulacion of postulaciones) {
      const periodo = this.monthKey(postulacion.postuladoEn);
      const current = series.get(periodo) ?? {
        periodo,
        ofertas: 0,
        postulaciones: 0,
      };
      current.postulaciones += 1;
      series.set(periodo, current);
    }

    return [...series.values()].sort((a, b) =>
      a.periodo.localeCompare(b.periodo),
    );
  }

  async adminEgresadosPorCarrera(input: AdminEgresadosPorCarreraInput) {
    this.assertValidDateRange(input.fechaDesde, input.fechaHasta);

    const egresados = await this.prisma.egresado.findMany({
      where: this.buildEgresadoWhereFromFilters(input),
      select: {
        carreraId: true,
        carrera: {
          select: {
            nombre: true,
          },
        },
      },
    });

    const grouped = new Map<
      string,
      { carreraId: string | null; carrera: string; total: number }
    >();

    for (const egresado of egresados) {
      const key = egresado.carreraId ?? 'sin-carrera';
      const current = grouped.get(key) ?? {
        carreraId: egresado.carreraId,
        carrera: egresado.carrera?.nombre ?? 'Sin carrera',
        total: 0,
      };
      current.total += 1;
      grouped.set(key, current);
    }

    return [...grouped.values()].sort((a, b) => b.total - a.total);
  }

  async adminDemandaHabilidades(input: AdminDemandaHabilidadesInput) {
    this.assertValidDateRange(input.fechaDesde, input.fechaHasta);
    const limit = Math.min(input.limit ?? 10, 50);

    const rows = await this.prisma.habilidadOferta.findMany({
      where: {
        oferta: {
          is: this.buildOfertaWhereFromFilters(input),
        },
      },
      select: {
        habilidadId: true,
        habilidad: {
          select: {
            nombre: true,
            tipo: true,
            categoria: true,
          },
        },
      },
    });

    const grouped = new Map<
      string,
      {
        habilidadId: string;
        habilidad: string;
        tipo: (typeof rows)[number]['habilidad']['tipo'];
        categoria: string | null;
        totalOfertas: number;
      }
    >();

    for (const row of rows) {
      const current = grouped.get(row.habilidadId) ?? {
        habilidadId: row.habilidadId,
        habilidad: row.habilidad.nombre,
        tipo: row.habilidad.tipo,
        categoria: row.habilidad.categoria,
        totalOfertas: 0,
      };
      current.totalOfertas += 1;
      grouped.set(row.habilidadId, current);
    }

    return [...grouped.values()]
      .sort((a, b) => b.totalOfertas - a.totalOfertas)
      .slice(0, limit);
  }

  async adminContratacionPorCohorte(input: AdminContratacionPorCohorteInput) {
    const egresados = await this.prisma.egresado.findMany({
      where: {
        ...(input.carreraId ? { carreraId: input.carreraId } : {}),
      },
      select: {
        id: true,
        anioEgreso: true,
      },
    });

    const contratados = await this.prisma.postulacion.findMany({
      where: {
        estado: EstadoPostulacion.CONTRATADO,
        ...(input.carreraId
          ? {
              egresado: {
                is: {
                  carreraId: input.carreraId,
                },
              },
            }
          : {}),
      },
      distinct: ['egresadoId'],
      select: {
        egresadoId: true,
      },
    });

    const contratadosSet = new Set(contratados.map((item) => item.egresadoId));
    const grouped = new Map<
      string,
      {
        anioEgreso: number | null;
        totalEgresados: number;
        contratados: number;
        tasaContratacion: number;
      }
    >();

    for (const egresado of egresados) {
      const key = String(egresado.anioEgreso ?? 'null');
      const current = grouped.get(key) ?? {
        anioEgreso: egresado.anioEgreso,
        totalEgresados: 0,
        contratados: 0,
        tasaContratacion: 0,
      };

      current.totalEgresados += 1;

      if (contratadosSet.has(egresado.id)) {
        current.contratados += 1;
      }

      grouped.set(key, current);
    }

    return [...grouped.values()]
      .map((item) => ({
        ...item,
        tasaContratacion: this.percentage(
          item.contratados,
          item.totalEgresados,
        ),
      }))
      .sort((a, b) => {
        if (a.anioEgreso === null) {
          return 1;
        }

        if (b.anioEgreso === null) {
          return -1;
        }

        return a.anioEgreso - b.anioEgreso;
      });
  }

  async adminPostulacionesPorEstado(input: AdminPostulacionesPorEstadoInput) {
    this.assertValidDateRange(input.fechaDesde, input.fechaHasta);
    const rows = await this.prisma.postulacion.groupBy({
      by: ['estado'],
      where: this.buildPostulacionWhereFromFilters(input),
      _count: {
        _all: true,
      },
    });

    return this.fillEstadoPostulacionCounts(
      rows.map((row) => ({
        estado: row.estado,
        total: row._count._all,
      })),
    );
  }

  async egresadoResumen(egresadoId: string) {
    await this.ensureEgresadoExists(egresadoId);
    const [rows, recomendaciones] = await Promise.all([
      this.prisma.postulacion.groupBy({
        by: ['estado'],
        where: {
          egresadoId,
        },
        _count: {
          _all: true,
        },
      }),
      this.countRecommendedOffers(egresadoId),
    ]);

    const counts = this.fillEstadoPostulacionCounts(
      rows.map((row) => ({
        estado: row.estado,
        total: row._count._all,
      })),
    );

    const totalPostulaciones = counts.reduce(
      (sum, item) => sum + item.total,
      0,
    );
    const getCount = (estado: EstadoPostulacion) =>
      counts.find((item) => item.estado === estado)?.total ?? 0;
    const responded =
      totalPostulaciones - getCount(EstadoPostulacion.POSTULADO);

    return {
      totalPostulaciones,
      enRevision: getCount(EstadoPostulacion.EN_REVISION),
      entrevistas: getCount(EstadoPostulacion.ENTREVISTA),
      contratado: getCount(EstadoPostulacion.CONTRATADO),
      rechazado: getCount(EstadoPostulacion.RECHAZADO),
      tasaRespuesta: this.percentage(responded, totalPostulaciones),
      ofertasRecomendadas: recomendaciones,
    };
  }

  async egresadoPostulacionesPorEstado(egresadoId: string) {
    await this.ensureEgresadoExists(egresadoId);
    const rows = await this.prisma.postulacion.groupBy({
      by: ['estado'],
      where: {
        egresadoId,
      },
      _count: {
        _all: true,
      },
    });

    return this.fillEstadoPostulacionCounts(
      rows.map((row) => ({
        estado: row.estado,
        total: row._count._all,
      })),
    );
  }

  async egresadoRecomendacionesBasicas(
    egresadoId: string,
    input: EgresadoRecomendacionesBasicasInput,
  ) {
    await this.ensureEgresadoExists(egresadoId);
    const limit = Math.min(input.limit ?? 10, 20);
    const [habilidades, postulaciones] = await Promise.all([
      this.prisma.habilidadEgresado.findMany({
        where: {
          egresadoId,
        },
        select: {
          habilidadId: true,
        },
      }),
      this.prisma.postulacion.findMany({
        where: {
          egresadoId,
        },
        select: {
          ofertaId: true,
        },
      }),
    ]);

    const skillIds = habilidades.map((item) => item.habilidadId);

    if (skillIds.length === 0) {
      return [];
    }

    const postuladas = new Set(postulaciones.map((item) => item.ofertaId));
    const ofertas = await this.prisma.ofertaLaboral.findMany({
      where: {
        estado: EstadoOferta.ACTIVA,
        ...(postuladas.size > 0
          ? {
              id: {
                notIn: [...postuladas],
              },
            }
          : {}),
        habilidades: {
          some: {
            habilidadId: {
              in: skillIds,
            },
          },
        },
      },
      select: {
        id: true,
        titulo: true,
        empresa: {
          select: {
            nombreComercial: true,
          },
        },
        habilidades: {
          select: {
            habilidadId: true,
          },
        },
      },
    });

    const skillSet = new Set(skillIds);

    return ofertas
      .map((oferta) => {
        const totalHabilidadesOferta = oferta.habilidades.length;
        const coincidencias = oferta.habilidades.filter((habilidad) =>
          skillSet.has(habilidad.habilidadId),
        ).length;

        return {
          ofertaId: oferta.id,
          titulo: oferta.titulo,
          empresa: oferta.empresa.nombreComercial,
          coincidencias,
          totalHabilidadesOferta,
          porcentajeMatch: this.percentage(
            coincidencias,
            totalHabilidadesOferta,
          ),
        };
      })
      .sort((a, b) => {
        if (b.porcentajeMatch !== a.porcentajeMatch) {
          return b.porcentajeMatch - a.porcentajeMatch;
        }

        return b.coincidencias - a.coincidencias;
      })
      .slice(0, limit);
  }

  async empresaResumen(empresaId: string, input: EmpresaResumenInput) {
    await this.ensureEmpresaExists(empresaId);
    this.assertValidDateRange(input.fechaDesde, input.fechaHasta);

    const ofertaWhere = {
      ...this.buildOfertaWhereFromFilters(input),
      empresaId,
    } satisfies Prisma.OfertaLaboralWhereInput;
    const postulacionWhere = {
      ...this.buildPostulacionWhereFromFilters(input),
      oferta: {
        is: {
          empresaId,
        },
      },
    } satisfies Prisma.PostulacionWhereInput;

    const [
      totalOfertas,
      ofertasActivas,
      totalPostulaciones,
      entrevistas,
      contratados,
      postulantes,
    ] = await Promise.all([
      this.prisma.ofertaLaboral.count({ where: ofertaWhere }),
      this.prisma.ofertaLaboral.count({
        where: {
          ...ofertaWhere,
          estado: EstadoOferta.ACTIVA,
        },
      }),
      this.prisma.postulacion.count({ where: postulacionWhere }),
      this.prisma.postulacion.count({
        where: {
          ...postulacionWhere,
          estado: EstadoPostulacion.ENTREVISTA,
        },
      }),
      this.prisma.postulacion.count({
        where: {
          ...postulacionWhere,
          estado: EstadoPostulacion.CONTRATADO,
        },
      }),
      this.prisma.postulacion.findMany({
        where: postulacionWhere,
        distinct: ['egresadoId'],
        select: {
          egresadoId: true,
        },
      }),
    ]);

    return {
      totalOfertas,
      ofertasActivas,
      totalPostulaciones,
      postulantesUnicos: postulantes.length,
      entrevistas,
      contratados,
      tasaConversion: this.percentage(contratados, totalPostulaciones),
    };
  }

  async empresaEmbudoPostulantes(
    empresaId: string,
    input: EmpresaEmbudoPostulantesInput,
  ) {
    await this.ensureEmpresaExists(empresaId);
    this.assertValidDateRange(input.fechaDesde, input.fechaHasta);

    if (input.ofertaId) {
      await this.assertEmpresaOwnsOferta(empresaId, input.ofertaId);
    }

    const rows = await this.prisma.postulacion.groupBy({
      by: ['estado'],
      where: {
        ...this.buildPostulacionWhereFromFilters(input),
        ...(input.ofertaId
          ? { ofertaId: input.ofertaId }
          : {
              oferta: {
                is: {
                  empresaId,
                },
              },
            }),
      },
      _count: {
        _all: true,
      },
    });

    return this.fillEstadoPostulacionCounts(
      rows.map((row) => ({
        estado: row.estado,
        total: row._count._all,
      })),
    );
  }

  async empresaRendimientoOfertas(
    empresaId: string,
    input: EmpresaRendimientoOfertasInput,
  ) {
    await this.ensureEmpresaExists(empresaId);
    const pagination = normalizePagination(input.page, input.limit);
    const where: Prisma.OfertaLaboralWhereInput = {
      empresaId,
      ...(input.estado ? { estado: input.estado } : {}),
    };

    const [data, total] = await runPaginatedReadQueries(
      this.prisma.ofertaLaboral.findMany({
        where,
        select: {
          id: true,
          titulo: true,
          estado: true,
          postulaciones: {
            select: {
              estado: true,
            },
          },
        },
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ actualizadoEn: 'desc' }, { creadoEn: 'desc' }],
      }),
      this.prisma.ofertaLaboral.count({ where }),
    );

    return {
      data: data.map((oferta) => {
        const totalPostulaciones = oferta.postulaciones.length;
        const entrevistas = oferta.postulaciones.filter(
          (postulacion) => postulacion.estado === EstadoPostulacion.ENTREVISTA,
        ).length;
        const contratados = oferta.postulaciones.filter(
          (postulacion) => postulacion.estado === EstadoPostulacion.CONTRATADO,
        ).length;

        return {
          ofertaId: oferta.id,
          titulo: oferta.titulo,
          estado: oferta.estado,
          totalPostulaciones,
          entrevistas,
          contratados,
          tasaConversion: this.percentage(contratados, totalPostulaciones),
        };
      }),
      meta: buildPaginationMeta(total, pagination.page, pagination.limit),
    };
  }

  private assertValidDateRange(fechaDesde?: Date, fechaHasta?: Date) {
    if (fechaDesde && fechaHasta && fechaDesde > fechaHasta) {
      throw new BadRequestException(
        'fechaDesde no puede ser mayor que fechaHasta',
      );
    }
  }

  private percentage(part: number, total: number) {
    if (total <= 0) {
      return 0;
    }

    return Number(((part / total) * 100).toFixed(2));
  }

  private monthKey(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0',
    )}`;
  }

  private fillEstadoPostulacionCounts(
    rows: EstadoPostulacionCount[],
  ): EstadoPostulacionCount[] {
    const map = new Map(rows.map((row) => [row.estado, row.total]));

    return ESTADO_FLOW.map((estado) => ({
      estado,
      total: map.get(estado) ?? 0,
    }));
  }

  private buildOfertaWhereFromFilters(
    input: Partial<
      DateRangeInput & {
        modalidad: ModalidadOferta;
        sectorId: string;
        ciudad: string;
        region: string;
      }
    >,
  ): Prisma.OfertaLaboralWhereInput {
    const dateRange = this.buildDateFilter(input.fechaDesde, input.fechaHasta);

    return {
      ...(input.modalidad ? { modalidad: input.modalidad } : {}),
      ...(input.ciudad
        ? {
            ciudad: {
              contains: input.ciudad.trim(),
              mode: 'insensitive',
            },
          }
        : {}),
      ...(input.region
        ? {
            region: {
              contains: input.region.trim(),
              mode: 'insensitive',
            },
          }
        : {}),
      ...(input.sectorId
        ? {
            empresa: {
              is: {
                sectorId: input.sectorId,
              },
            },
          }
        : {}),
      ...(dateRange
        ? {
            OR: [
              {
                publicadoEn: dateRange,
              },
              {
                AND: [
                  {
                    publicadoEn: null,
                  },
                  {
                    creadoEn: dateRange,
                  },
                ],
              },
            ],
          }
        : {}),
    };
  }

  private buildPostulacionWhereFromFilters(
    input: Partial<
      DateRangeInput & {
        carreraId: string;
        sectorId: string;
        ciudad: string;
        region: string;
        modalidad: ModalidadOferta;
      }
    >,
  ): Prisma.PostulacionWhereInput {
    const dateRange = this.buildDateFilter(input.fechaDesde, input.fechaHasta);
    const ofertaFilters =
      input.modalidad || input.sectorId || input.ciudad || input.region
        ? this.buildOfertaWhereFromFilters({
            modalidad: input.modalidad,
            sectorId: input.sectorId,
            ciudad: input.ciudad,
            region: input.region,
          })
        : null;

    return {
      ...(dateRange ? { postuladoEn: dateRange } : {}),
      ...(input.carreraId
        ? {
            egresado: {
              is: {
                carreraId: input.carreraId,
              },
            },
          }
        : {}),
      ...(ofertaFilters
        ? {
            oferta: {
              is: ofertaFilters,
            },
          }
        : {}),
    };
  }

  private buildEgresadoWhereFromFilters(
    input: Partial<
      DateRangeInput & {
        carreraId: string;
        ciudad: string;
        region: string;
      }
    >,
  ): Prisma.EgresadoWhereInput {
    const dateRange = this.buildDateFilter(input.fechaDesde, input.fechaHasta);

    return {
      ...(input.carreraId ? { carreraId: input.carreraId } : {}),
      ...(input.ciudad
        ? {
            ciudad: {
              contains: input.ciudad.trim(),
              mode: 'insensitive',
            },
          }
        : {}),
      ...(input.region
        ? {
            region: {
              contains: input.region.trim(),
              mode: 'insensitive',
            },
          }
        : {}),
      ...(dateRange ? { creadoEn: dateRange } : {}),
    };
  }

  private buildEmpresaWhereFromFilters(
    input: Partial<
      DateRangeInput & {
        sectorId: string;
        ciudad: string;
        region: string;
      }
    >,
  ): Prisma.EmpresaWhereInput {
    const dateRange = this.buildDateFilter(input.fechaDesde, input.fechaHasta);

    return {
      ...(input.sectorId ? { sectorId: input.sectorId } : {}),
      ...(input.ciudad
        ? {
            ciudad: {
              contains: input.ciudad.trim(),
              mode: 'insensitive',
            },
          }
        : {}),
      ...(input.region
        ? {
            region: {
              contains: input.region.trim(),
              mode: 'insensitive',
            },
          }
        : {}),
      ...(dateRange ? { creadoEn: dateRange } : {}),
    };
  }

  private buildDateFilter(fechaDesde?: Date, fechaHasta?: Date) {
    if (!fechaDesde && !fechaHasta) {
      return undefined;
    }

    return {
      ...(fechaDesde ? { gte: fechaDesde } : {}),
      ...(fechaHasta ? { lte: fechaHasta } : {}),
    };
  }

  private async ensureEgresadoExists(egresadoId: string) {
    const egresado = await this.prisma.egresado.findUnique({
      where: { id: egresadoId },
      select: { id: true },
    });

    if (!egresado) {
      throw new NotFoundException('Perfil de egresado no encontrado');
    }
  }

  private async ensureEmpresaExists(empresaId: string) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { id: empresaId },
      select: { id: true },
    });

    if (!empresa) {
      throw new NotFoundException('Perfil de empresa no encontrado');
    }
  }

  private async assertEmpresaOwnsOferta(empresaId: string, ofertaId: string) {
    const oferta = await this.prisma.ofertaLaboral.findUnique({
      where: { id: ofertaId },
      select: {
        id: true,
        empresaId: true,
      },
    });

    if (!oferta) {
      throw new NotFoundException('Oferta no encontrada');
    }

    if (oferta.empresaId !== empresaId) {
      throw new ForbiddenException('No tienes acceso a esta oferta');
    }
  }

  private async countRecommendedOffers(egresadoId: string) {
    const habilidades = await this.prisma.habilidadEgresado.findMany({
      where: { egresadoId },
      select: { habilidadId: true },
    });

    const skillIds = habilidades.map((item) => item.habilidadId);

    if (skillIds.length === 0) {
      return 0;
    }

    const postulaciones = await this.prisma.postulacion.findMany({
      where: { egresadoId },
      select: { ofertaId: true },
    });

    const postuladas = postulaciones.map((item) => item.ofertaId);

    return this.prisma.ofertaLaboral.count({
      where: {
        estado: EstadoOferta.ACTIVA,
        ...(postuladas.length > 0
          ? {
              id: {
                notIn: postuladas,
              },
            }
          : {}),
        habilidades: {
          some: {
            habilidadId: {
              in: skillIds,
            },
          },
        },
      },
    });
  }
}
