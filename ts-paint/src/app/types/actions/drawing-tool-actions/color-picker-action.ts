import { DrawingToolAction } from './drawing-tool-action';
import { Point } from '../../../types/base/point';
import { Color } from '../../../types/base/color';
import { TsPaintStoreState } from '../../../services/ts-paint/ts-paint.store.state';
import { getPixel } from '../../../helpers/drawing.helpers';
import { SetColorAction } from '../set-color-action';
import { TsPaintAction } from '../ts-paint-action';

export class ColorPickerAction extends DrawingToolAction {
  protected draw(points: Point[], color1: Color, color2: Color, image: ImageData) {}

  protected addPatches(state: TsPaintStoreState): Partial<TsPaintStoreState> {
    const color: Color = getPixel(this.points[0], state.image);

    return SetColorAction.getSetColorPatches(!this.swapColors, color, state);
  }

  protected getUndoActions(state: TsPaintStoreState): TsPaintAction[] {
    return SetColorAction.getSetColorUndoActions(!this.swapColors, state);
  }
}
