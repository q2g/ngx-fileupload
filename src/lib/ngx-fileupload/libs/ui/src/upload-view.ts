import { Component, TemplateRef, Input, OnInit, OnDestroy } from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { Validator, ValidationFn } from "../../../data/api/validation";
import { UploadRequest, UploadStorage } from "../../upload";
import { FileUploadItemContext } from "./upload-item.component";

@Component({
    selector: "ngx-fileupload",
    styleUrls: ["./upload-view.scss"],
    templateUrl: "upload-view.html",
})
export class UploadViewComponent implements OnInit, OnDestroy {

    /**
     * set custom template, will pass through to [NgxFileUploadItem]{@link NgxFileUploadItemComponent.html#itemTpl}
     */
    @Input()
    public itemTemplate: TemplateRef<FileUploadItemContext>;

    @Input()
    public url: string;

    @Input()
    public useFormData = true;

    @Input()
    public formDataName = "file";

    @Input()
    public validator: Validator | ValidationFn;

    @Input()
    public set storage(storage: UploadStorage) {
        this.uploadStorage = storage;
        this.uploadStorageSet = true;
    }

    public uploadStorage: UploadStorage;

    public uploads: UploadRequest[] = [];

    private destroyed$: Subject<boolean> = new Subject();

    private uploadStorageSet = false;

    public ngOnInit() {

        if (!this.uploadStorage) {
            this.uploadStorage = new UploadStorage();
        }

        this.registerStoreEvents();
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);

        /** we handle our own storage so destroy this one */
        if (!this.uploadStorageSet) {
            this.uploadStorage.destroy();
            this.uploadStorage = null;
        }
    }

    /**
     * register events for store changes
     */
    private registerStoreEvents() {
        this.uploadStorage.change()
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (uploads) => this.uploads = uploads
            });
    }
}
