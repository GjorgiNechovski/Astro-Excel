export interface ICellStyle {
  width: string | undefined;
  height: string | undefined;
  backgroundColor: string | undefined;
  border: string | undefined;
  padding: string | undefined;
  textAlign: TextAlign | undefined;
  justifyContent?: string;
  alignItems?: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
}

export class Cell {
  constructor(
    public data: any,
    public row: number,
    public col: number,
    public disabled: boolean,
    public styles?: ICellStyle | undefined
  ) {}
}

type TextAlign = "left" | "center" | "right" | "justify" | "start" | "end";
