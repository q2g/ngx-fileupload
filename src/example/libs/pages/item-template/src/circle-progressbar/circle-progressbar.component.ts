import { Component } from "@angular/core";
import { Upload } from "@r-hannuschka/ngx-fileupload";

@Component({
    selector: "app-item-template--circle-progressbar",
    templateUrl: "circle-progressbar.component.html",
    styleUrls: ["./circle-progressbar.component.scss"]
})

export class CircleProgressbarComponent {

    public uploads: Upload[] = [];

    public onUploadAdd(uploads: Upload[]) {
        this.uploads = [...this.uploads, ...uploads];
    }

    public uploadCompleted(completed: Upload) {
        if (!completed.hasError()) {
            this.uploads = this.uploads.filter((upload) => completed !== upload);
        }
    }
}
