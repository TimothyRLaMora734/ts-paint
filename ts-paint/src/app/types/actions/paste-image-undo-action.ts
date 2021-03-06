import { TsPaintAction } from './ts-paint-action';
import { TsPaintStoreState } from '../../services/ts-paint/ts-paint.store.state';
import { PartialActionResult } from './partial-action-result';
import { resizeImage } from '../../helpers/image.helpers';

/** This action exists only  to avoid a circular dependency in DeleteSelectionAction */
export class PasteImageUndoAction extends TsPaintAction {
  constructor(private _imagePart: ImageData) {
    super('image');
    this._deselectsSelection = true;
  }

  protected addPatchesAndDraw(state: TsPaintStoreState): PartialActionResult {
    const patches: Partial<TsPaintStoreState> = {};
    patches.selectionOffset = { w: 0, h: 0 };
    patches.selectionImage = this._imagePart;
    patches.moveSelectionTool = undefined; // It will get initialized if needed

    if (this._imagePart.width > state.image.width || this._imagePart.height > state.image.height) {
      const image: ImageData = resizeImage(
        state.image,
        Math.max(this._imagePart.width, state.image.width),
        Math.max(this._imagePart.height, state.image.height),
        state.secondaryColor
      );
      return { image, patches };
    } else {
      return { patches };
    }
  }

  protected getUndoActions(state: TsPaintStoreState): TsPaintAction[] {
    return [];
  }
}
