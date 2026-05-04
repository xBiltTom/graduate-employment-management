import React from 'react';

type PagePlaceholderProps = {
  title: string;
  description?: string;
};

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col items-center justify-center space-y-4 rounded-xl border border-dashed p-12 bg-muted/50 w-full max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-foreground capitalize">{title}</h1>
        {description ? (
          <p className="text-muted-foreground">{description}</p>
        ) : (
          <p className="text-muted-foreground">Esta página está en construcción. Los componentes se conectarán en fases posteriores.</p>
        )}
      </div>
    </div>
  );
}
