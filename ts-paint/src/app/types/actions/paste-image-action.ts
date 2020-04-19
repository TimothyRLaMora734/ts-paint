import { TsPaintAction } from './ts-paint-action';
import { TsPaintStoreState } from 'src/app/services/ts-paint/ts-paint.store.state';
import { PartialActionResult } from './partial-action-result';
import { MoveSelectionAction } from './move-selection-action';
import { MoveSelectionTool } from '../drawing-tools/move-selection-tool';

export class PasteImageAction extends TsPaintAction {
  constructor(private imagePart: ImageData) {
    super('nowhere');
  }

  protected addPatchesAndDraw(state: TsPaintStoreState): PartialActionResult {
    const patches: Partial<TsPaintStoreState> = {};
    patches.selectionOffset = { w: 0, h: 0 };
    patches.selectionImage = this.imagePart;
    patches.moveSelectionTool = undefined; // It will get initialized if needed

    return { patches };
  }

  protected getUndoActions(state: TsPaintStoreState): TsPaintAction[] {
    return [
      new PasteImageAction(state.selectionImage),
      new MoveSelectionAction(state.selectionOffset)
    ];
  }
}