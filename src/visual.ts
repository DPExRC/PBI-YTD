import * as d3 from "d3";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import IViewport = powerbi.IViewport;

// 1. Define la interfaz — resuelve los errores de 'varAbsPres no existe'
interface AreaData {
  area:        string;
  realActual:  number;
  presupuesto: number;
  realAnterior:number;
  varAbsPres:  number;
  varPctPres:  number | null;
  varAbsAnt:   number;
  varPctAnt:   number | null;
}

export class Visual implements IVisual {
  // 2. Tipo correcto para SVG — resuelve el error 2322
  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;

  constructor(options: VisualConstructorOptions) {
    this.svg = d3.select(options.element)
      .append("svg");
  }

  public update(options: VisualUpdateOptions) {
    const dataView = options.dataViews?.[0];

    // 3. Guards para undefined — resuelve los errores 18048
    if (!dataView?.categorical?.categories?.[0] || !dataView.categorical.values) {
      return;
    }

    const categories = dataView.categorical.categories[0];
    const values     = dataView.categorical.values;

    // 4. Tipado explícito con la interfaz — resuelve los errores 2339
    const data: AreaData[] = categories.values.map((area, i) => {
      const realActual   = (values[0]?.values[i] as number) || 0;
      const presupuesto  = (values[1]?.values[i] as number) || 0;
      const realAnterior = (values[2]?.values[i] as number) || 0;

      return {
        area:         area as string,
        realActual,
        presupuesto,
        realAnterior,
        varAbsPres:   realActual - presupuesto,
        varPctPres:   presupuesto !== 0 ? (realActual / presupuesto - 1) : null,
        varAbsAnt:    realActual - realAnterior,
        varPctAnt:    realAnterior !== 0 ? (realActual / realAnterior - 1) : null,
      };
    });

    this.render(data, options.viewport);
  }

  // 5. Tipos explícitos en parámetros — resuelve los errores 7006
  private render(data: AreaData[], viewport: IViewport): void {
    this.svg
      .attr("width", viewport.width)
      .attr("height", viewport.height);

    // Tu lógica D3 acá
  }
}