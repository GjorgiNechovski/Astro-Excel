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
  fontFamily?: string;
  fontStyle?: string;
  textDecoration?: string;
  color?: string;
}

export class Cell {
  constructor(
    public realValue: any,
    public displayValue: any,
    public row: number,
    public col: number,
    public disabled: boolean,
    public styles?: ICellStyle | undefined
  ) {}
}

export type TextAlign =
  | "left"
  | "center"
  | "right"
  | "justify"
  | "start"
  | "end";
