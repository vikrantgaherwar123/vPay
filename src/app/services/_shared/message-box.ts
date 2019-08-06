import { MatDialog, MAT_DIALOG_DATA } from "@angular/material";
// import { SimpleDialogComponent } from "../simple-dialog/simple-dialog.component";
import { DialogBoxComponent } from "../../shared/component/dialogBox/dialogBox.component";

export class MessageBox {
  static show(dialog: MatDialog, message, messagea, button = "", title = "Vpay",
    information = "", allow_outside_click = false,
    style = 1, width = "auto") {
    const dialogRef = dialog.open(DialogBoxComponent, {
      data: {
        title: title || "Vpay",
        message: message,
        messagea: messagea,
        information: information,
        button: button || '0',
        style: style || 0,
        allow_outside_click: allow_outside_click || false
      },
      width: width
    });
    return dialogRef.afterClosed();
  }
}

export enum MessageBoxButton {
  Ok = '0',
  OkCancel = '1',
  YesNo = '2',
  AcceptReject = '3'
}

export enum MessageBoxStyle {
  Simple = 0,
  Full = 1
};
