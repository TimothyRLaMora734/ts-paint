import { Injectable } from '@angular/core';
import { TsPaintStoreState } from './ts-paint.store.state';
import { Store } from 'rxjs-observable-store';
import { MenuActionType } from 'src/app/types/menu/menu-action-type';
import { assertUnreachable } from 'src/app/helpers/typescript.helpers';
import { PaintableColor } from 'src/app/types/base/paintable-color';
import { Color } from 'src/app/types/base/color';
import { Point } from 'src/app/types/base/point';
import { ImageSelection } from 'src/app/types/base/image-selection';
import { TsPaintService } from './ts-paint.service';
import { MouseButtonEvent } from 'src/app/types/mouse-tracker/mouse-button-event';
import { DrawingToolType } from 'src/app/types/drawing-tools/drawing-tool-type';
import { DrawingTool } from 'src/app/types/drawing-tools/drawing-tool';
import { ColorSelection } from 'src/app/types/base/color-selection';
import { DrawLineExecutor } from 'src/app/types/actions/draw-line/draw-line-executor';
import { TsPaintStatePatch } from './ts-paint-state-patch';
import { DrawingToolAction } from 'src/app/types/actions/drawing-tool-action';
import { DrawPencilExecutor } from 'src/app/types/actions/draw-pencil/draw-pencil-executor';
import { ActionExecutor } from 'src/app/types/actions/action-executor';

@Injectable()
export class TsPaintStore extends Store<TsPaintStoreState>{
  constructor(private tsPaintService: TsPaintService) {
    super(new TsPaintStoreState());
  }

  executeMenuAction(menuAction: MenuActionType) {
    const menuActionFunction: () => void = this.getMenuActionFunction(menuAction);
    menuActionFunction();
  }

  setDrawingTool(toolType: DrawingToolType) {
    this.patchState(this.getDrawingTool(toolType), 'selectedDrawingTool');
  }

  setColor(selection: ColorSelection) {
    if (selection.primary) {
      this.patchState(selection.color, 'primaryColor');
    } else {
      this.patchState(selection.color, 'secondaryColor');
    }
  }

  processMouseDown(event: MouseButtonEvent) {
    this.state.selectedDrawingTool?.mouseDown(event);
  }

  processMouseUp(point: Point) {
    this.state.selectedDrawingTool?.mouseUp(point);
  }

  processMouseMove(point: Point) {
    this.state.selectedDrawingTool?.mouseMove(point);
  }

  processMouseScroll(event: MouseWheelEvent) {
    //TODO: Zooming
  }

  private getMenuActionFunction(menuAction: MenuActionType): () => void {
    switch (menuAction) {
      case MenuActionType.OPEN_FILE: return this.openFile.bind(this);
      case MenuActionType.SAVE_FILE: return this.saveFile.bind(this);
      case MenuActionType.UNDO: return this.undo.bind(this);
      case MenuActionType.REPEAT: return this.repeat.bind(this);
      case MenuActionType.CLEAR_IMAGE: return this.clearImage.bind(this);
    }

    assertUnreachable(menuAction);
  }

  private getDrawingTool(toolType: DrawingToolType): DrawingTool {
    return new DrawingTool(toolType, this.addDrawingToolAction.bind(this));
  }

  private addDrawingToolAction(action: DrawingToolAction) {
    if (action.preview) {
      this.patchState(action, 'previewAction');
    } else {
      this.patchState(undefined, 'previewAction');
      this.patchState(this.state.actions.concat(action), 'actions');
    }

    this.executeDrawingToolAction(action);
  }

  private executeDrawingToolAction(action: DrawingToolAction) {
    let patches: TsPaintStatePatch<any>[];
    let executor: ActionExecutor<any>;

    switch (action.tool) {
      case DrawingToolType.pencil:
        executor = new DrawPencilExecutor(() => this.state);
        break;
      case DrawingToolType.line:
        executor = new DrawLineExecutor(() => this.state);
        break;
      default:
        assertUnreachable(action.tool);
    }

    patches = executor.execute(action);
    patches.forEach(patch => {
      this.patchState(patch.value, patch.property);
    });
  }

  private openFile() {
    this.tsPaintService.openFile().then(value => {
      this.patchState(value.imageData, 'image');
      this.patchState(value.fileName, 'fileName');
    });
  }

  private saveFile() {
    this.tsPaintService.saveFile({ imageData: this.state.image, fileName: this.state.fileName });
  }

  private undo() {

  }

  private repeat() {

  }

  private clearImage() {

  }

  paintArea(minW: number, minH: number, maxW: number, maxH: number, color?: PaintableColor): void {

  }
  saveChanges(): void {

  }

  clearChanges(): void {

  }

  getImageData(): ImageData {
    return undefined;
  }
  batchPaintPixels(pixels: number[][]): void {

  }
  setSelectedColor(color: Color, primary: boolean): void {

  }
  /*imageSelection: ImageData{

  }
  initialSelectionLocation: Point{

  }*/
  pasteImage(imageSelection: ImageData, w: number, h: number): void {

  }
  setSelection(startPoint: Point, endPoint: Point): void {

  }

  getSelection(): ImageSelection {
    return undefined;
  }
}