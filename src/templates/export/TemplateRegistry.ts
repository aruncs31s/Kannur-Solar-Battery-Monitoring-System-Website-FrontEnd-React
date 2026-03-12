import type { IExportTemplate } from '../../domain/export/IExportTemplate';

// Single Responsibility: manages template registration only
// Open/Closed: new templates can be registered without changing existing code
export class TemplateRegistry {
  private readonly templates = new Map<string, IExportTemplate<unknown>>();

  register<T>(template: IExportTemplate<T>): void {
    this.templates.set(template.id, template as IExportTemplate<unknown>);
  }

  get<T>(id: string): IExportTemplate<T> | undefined {
    return this.templates.get(id) as IExportTemplate<T> | undefined;
  }

  getAll(): IExportTemplate<unknown>[] {
    return Array.from(this.templates.values());
  }

  has(id: string): boolean {
    return this.templates.has(id);
  }
}
