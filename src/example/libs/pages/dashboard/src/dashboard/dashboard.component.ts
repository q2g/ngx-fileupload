import { Component, OnInit, Inject } from "@angular/core";
import { UploadStorage } from "@r-hannuschka/ngx-fileupload";
import { ExampleUploadStorage } from "@ngx-fileupload-example/data/base/upload-storage";

@Component({
    selector: "app-dashboard",
    templateUrl: "dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {

    constructor(
        @Inject(ExampleUploadStorage) public storage: UploadStorage
    ) { }

    ngOnInit() { }
}
