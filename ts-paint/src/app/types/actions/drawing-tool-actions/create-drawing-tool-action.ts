import { DrawingToolType } from '../../drawing-tools/drawing-tool-type';
import { Point } from '../../base/point';
import { PencilAction } from './pencil-action';
import { LineAction } from './line-action';
import { assertUnreachable } from 'src/app/helpers/typescript.helpers';
import { RectangleSelectAction } from './rectangle-select-action';
import { DrawingToolAction } from './drawing-tool-action';
import { ColorPickerAction } from './color-picker-action';

export function createDrawingToolAction(toolType: DrawingToolType, points: Point[], swapColors: boolean, renderIn: 'image' | 'preview'): DrawingToolAction {
  switch (toolType) {
    case DrawingToolType.rectangleSelect:
      return new RectangleSelectAction(points, swapColors, renderIn);
    case DrawingToolType.colorPicker:
      return new ColorPickerAction(points, swapColors, renderIn);
    case DrawingToolType.pencil:
      return new PencilAction(points, swapColors, renderIn);
    case DrawingToolType.line:
      return new LineAction(points, swapColors, renderIn);
  }

  assertUnreachable(toolType);
}