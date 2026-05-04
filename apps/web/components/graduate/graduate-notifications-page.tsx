"use client";

import { useState } from "react";
import { mockNotifications } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Briefcase, FileText, CheckCircle2, MoreVertical, Check, Trash2 } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const getIconForType = (type?: string) => {
  switch (type) {
    case "NEW_OFFER":
      return <Briefcase className="h-5 w-5 text-blue-600" />;
    case "APPLICATION_UPDATE":
      return <FileText className="h-5 w-5 text-amber-600" />;
    case "SYSTEM":
      return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    default:
      return <Bell className="h-5 w-5 text-gray-600" />;
  }
};

const getBgForType = (type?: string) => {
  switch (type) {
    case "NEW_OFFER":
      return "bg-blue-100";
    case "APPLICATION_UPDATE":
      return "bg-amber-100";
    case "SYSTEM":
      return "bg-green-100";
    default:
      return "bg-gray-100";
  }
};

export function GraduateNotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === "unread") return !n.read;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-up max-w-[800px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="space-y-1">
          <h1 className="font-[var(--font-heading)] text-3xl font-bold text-[var(--color-text-heading)]">
            Notificaciones
          </h1>
          <p className="text-[var(--color-text-muted)]">
            Mantente al día con tus postulaciones y nuevas oportunidades.
          </p>
        </div>
        
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline" className="border-[var(--color-border-subtle)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] text-[var(--color-text-heading)]">
            <Check className="h-4 w-4 mr-2" /> Marcar todas como leídas
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        <Button 
          variant={filter === "all" ? "default" : "outline"} 
          onClick={() => setFilter("all")}
          className={filter === "all" ? "bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white shadow-sm" : "border-[var(--color-border-subtle)] text-[var(--color-text-heading)]"}
        >
          Todas
        </Button>
        <Button 
          variant={filter === "unread" ? "default" : "outline"} 
          onClick={() => setFilter("unread")}
          className={filter === "unread" ? "bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white shadow-sm" : "border-[var(--color-border-subtle)] text-[var(--color-text-heading)]"}
        >
          No leídas
          {unreadCount > 0 && (
            <Badge variant="secondary" className={`ml-2 px-1.5 min-w-[20px] justify-center ${filter === "unread" ? "bg-white text-[var(--color-brand)]" : "bg-[var(--color-brand)] text-white"}`}>
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      <Card className="border-[var(--color-border-subtle)] shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {filteredNotifications.length > 0 ? (
            <div className="divide-y divide-[var(--color-border-subtle)]">
              {filteredNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 sm:p-6 flex gap-4 transition-colors ${!notification.read ? 'bg-[var(--color-brand-light)]/20' : 'bg-white hover:bg-[var(--color-surface)]'}`}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full shrink-0 ${getBgForType(notification.type)}`}>
                    {getIconForType(notification.type)}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className={`font-semibold text-[var(--color-text-heading)] ${!notification.read ? 'pr-2' : ''}`}>
                        {notification.title}
                        {!notification.read && (
                          <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-brand)] ml-2 align-middle" />
                        )}
                      </h3>
                      <span className="text-xs text-[var(--color-text-muted)] whitespace-nowrap pt-1">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--color-text-body)] leading-relaxed">
                      {notification.content}
                    </p>
                    
                    {!notification.read && (
                      <div className="pt-2">
                        <Button 
                          variant="link" 
                          size="sm" 
                          onClick={() => markAsRead(notification.id)}
                          className="h-auto p-0 text-[var(--color-brand)] font-medium"
                        >
                          Marcar como leída
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)]">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="border-[var(--color-border-subtle)]">
                        {!notification.read && (
                          <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                            <Check className="h-4 w-4 mr-2" /> Marcar como leída
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => deleteNotification(notification.id)} className="text-[var(--color-error)] focus:text-[var(--color-error)]">
                          <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="h-16 w-16 rounded-full bg-[var(--color-surface)] flex items-center justify-center border border-[var(--color-border-subtle)] mb-4">
                <Bell className="h-8 w-8 text-[var(--color-text-muted)] opacity-50" />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-text-heading)]">No tienes notificaciones</h3>
              <p className="text-[var(--color-text-muted)] mt-2 max-w-sm">
                {filter === "unread" 
                  ? "¡Estás al día! No tienes notificaciones sin leer."
                  : "Cuando haya novedades sobre tus postulaciones u ofertas recomendadas, aparecerán aquí."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
