export const HTML = `
<!-- define custom template which should used for each upload -->
<ng-template #itemTemplate let-upload="data" let-ctrl="ctrl">
    <!--
        @see tab template for full template
    -->
</ng-template>

<div class="mt-3 ">

    <!-- upload toolbar -->
    <div class="btn-toolbar mb-3">
        <div class="input-group ml-auto" ngxFileUpload (add)="drop($event)" >
            <div class="input-group-prepend">
                <div class="input-group-text" id="btnGroupAddon">Files</div>
            </div>
            <input type="text" class="form-control" readonly placeholder="Drag Drop or Click">
        </div>

        <div class="btn-group ml-3">
            <button type="button" class="btn btn-secondary" (click)="uploadAll()">Upload All</button>
            <button type="button" class="btn btn-secondary" (click)="purge()">Clean Up</button>
            <button type="button" class="btn btn-secondary" (click)="stop()">Stop All</button>
        </div>
    </div>

    <!-- fileuploads -->
    <div class="card-list">
        <ng-container *ngFor="let upload of uploads">
            <ngx-fileupload-item [template]="itemTemplate" [upload]="upload"></ngx-fileupload-item>
        </ng-container>
    </div>
</div>

`;

export const TYPESCRIPT = `
import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { UploadStorage, UploadRequest, UploadState, NgxFileUploadFactory } from "@r-hannuschka/ngx-fileupload";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ExampleUploadStorage } from "@ngx-fileupload-example/data/base/upload-storage";

@Component({
    selector: "app-customize--item-template",
    templateUrl: "item-template.component.html",
    styleUrls: ["./item-template.component.scss"]
})
export class ItemTemplateComponent implements OnInit, OnDestroy {

    public uploadStates = UploadState;

    public uploads: UploadRequest[] = [];

    public destroy$: Subject<boolean> = new Subject();

    public constructor(
        @Inject(ExampleUploadStorage) public storage: UploadStorage,
        @Inject(NgxFileUploadFactory) private uploadFactory: NgxFileUploadFactory
    ) {}

    public ngOnInit() {
        this.storage.change()
            .pipe(takeUntil(this.destroy$))
            .subscribe((requests: UploadRequest[]) => this.uploads = requests);
    }

    public ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
        this.destroy$ = null;
    }

    public uploadAll() {
        this.storage.startAll();
    }

    public purge() {
        this.storage.purge();
    }

    public stop() {
        this.storage.stopAll();
    }

    public drop(files: File[]) {
        const uploadOptions: UploadOptions = { url: this.url };
        const requests = this.uploadFactory.createUploadRequest(files, uploadOptions);
        this.storage.add(requests);
    }
}
`;

export const TEMPLATE = `
<ng-template #itemTemplate let-upload="data" let-ctrl="ctrl" #custom>

    <div class="card upload">

        <div class="card-header d-flex justify-content-between align-items-center">
            <span class="title text-truncate">{{upload.name}}</span>

            <div class="actions btn-group">
                <app-ui--button
                    (dispatch)="ctrl.start()"
                    [class]="'btn-upload btn-sm'"
                    [disabled]="upload.state !== uploadStates.IDLE"
                    *ngIf="!upload.completed">

                    <i class="icon-left icon-upload"></i>
                </app-ui--button>

                <app-ui--button (dispatch)="ctrl.stop()" [disabled]= "!(upload | isCancelAble)" [class]="'btn.cancel btn-sm'">
                    <i class="icon-left icon-canceled"></i>
                </app-ui--button>

                <app-ui--button (dispatch)="ctrl.remove()">
                    <i class="icon-left icon-cancel"></i>
                </app-ui--button>
            </div>
        </div>

        <div class="card-body">
            <div class="progressbar">
                <app-ui--progressbar-circle
                    [circleData]="{height: 100, width: 100, radius: 40}"
                    [progress]="upload.progress" >
                </app-ui--progressbar-circle>
            </div>

            <div class="col details col-auto">
                <dl>
                    <dt class="label">State</dt>
                    <dd class="value text-truncate">{{upload.state | stateToString}}</dd>
                    <dt class="label">Uploaded</dt>
                    <dd class="value text-truncate">{{upload.uploaded | fileSize}} / {{upload.size | fileSize}}</dd>
                </dl>
            </div>
        </div>

        <div class="card-footer" *ngIf="upload.state === uploadStates.COMPLETED || upload.validationErrors">

            <!-- response completed show error / success -->
            <ng-container *ngIf="upload.state === uploadStates.COMPLETED"
                [ngTemplateOutlet]="upload.hasError ? errorTemplate : successTemplate"
                [ngTemplateOutletContext]="{data: upload.hasError ? upload.response.errors : upload.name}" >
            </ng-container>

            <ng-container *ngIf="upload.validationErrors"
                [ngTemplateOutlet]="invalidTemplate"
                [ngTemplateOutletContext]="{data: upload.validationErrors}" >
            </ng-container>
        </div>
    </div>
</ng-template>

<!-- upload error template -->
<ng-template #errorTemplate let-errors="data">
    <ul class="errors">
        <li *ngFor="let error of errors" class="error">{{error}}</li>
    </ul>
</ng-template>

<!-- upload success template -->
<ng-template #successTemplate let-name="data">
    <span class="success">
        {{name}} successful uploaded
    </span>
</ng-template>

<!-- upload validation error template -->
<ng-template #invalidTemplate let-validationErrors="data">
    <ul class="errors">
        <li class="error" *ngFor="let error of validationErrors | keyvalue">
            {{error.value}}
        </li>
    </ul>
</ng-template>
`;

export const SCSS = `
$icomoon-font-path: "../../../../../assets/fonts" !default;

@import "variables";
@import "icons";

:host {

    .card-list {
        display: flex;
        flex-wrap: wrap;

        ngx-fileupload-item {
            width: calc(100% / 3);
            padding: 0 .5rem;
            display: block;

            &:nth-child(3n + 1) {
                padding-left: 0;
            }

            &:nth-child(3n + 3) {
                padding-right: 0;
            }

            &:nth-child(n + 4) {
                margin-top: 1rem;
            }
        }

        ngx-fileupload-item .errors {
            list-style-type:none;
            margin: 0;
            padding: 0;

            li {
                color: #AF0606;
                display: flex;
                align-items: center;

                &:before {
                    @include icon;
                    content: $icon-warning;
                    font-size: 1.1rem;
                    margin-right: .5rem;
                }
            }
        }

        .card-header {
            padding: 0;

            .title {
                padding: 0.5rem 1.25rem;
            }

            .actions {
                padding: 0 .5rem;
                background: #6c757d;
                align-self: stretch;

                ::ng-deep {
                    .btn {
                        font-size: 1.3rem;
                        padding: 0 .125rem;
                    }

                    app-ui--button:not(:last-child) .btn {
                        border-top-right-radius: 0;
                        border-bottom-right-radius: 0;
                        padding: 0 .125rem 0 0;
                    }

                    app-ui--button:not(:first-child) .btn {
                        border-top-left-radius: 0;
                        border-bottom-left-radius: 0;
                        padding: 0 0 0 .125rem;
                    }
                }
            }
        }

        .card-body {

            display: flex;

            .details {
                flex: 1;
                dl {
                    font-size: .8rem;
                    margin-bottom: .5rem;
                }

                .label {
                    font-weight: 900;

                    &:after {
                        content: ":";
                        display: "inline-block";
                        margin-right: .5rem;
                    }
                }
            }

            .progressbar {

                svg circle {
                    stroke-width: .75rem;

                    &.progress {
                        stroke-width: .8rem;
                    }
                }

                svg text {
                    font-size: .7rem;
                    transform: translate(0, .3rem);
                }
            }
        }
    }

    .card.upload {
        font-size: .8rem;
    }

    .upload-items .actions {
        color: #343a40;
    }
}
`;

const ItemTemplateSnippet = `<ng-template #customTemplate let-upload="data" let-control="ctrl">
    <!-- template goes here -->
</ng-template>

<ng-container *ngFor="upload of uploads">
    <ngx-fileupload-item [template]="customTemplate" [upload]="upload"></ngx-fileupload-item>
</ng-container>
`;

const ItemTemplateSimpleSnippet = `<ng-template #customTemplate>
    <div class="row">
        <div class="col">
            <ul class="details">
                <li>
                    <span class="label">Name</span>
                    <span class="value text-truncate">{{upload.name}}</span>
                </li>
                <li>
                    <span class="label">Size</span>
                    <span class="value text-truncate">{{upload.size | fileSize}}</span>
                </li>
                <li>
                    <span class="label">Uploaded</span>
                    <span class="value text-truncate">{{upload.progress}} %</span>
                </li>
                <li>
                    <span class="label">State</span>
                    <span class="value text-truncate">{{upload.state}}</span>
                </li>
            </ul>

            <!-- display validation errors here -->
            <ul *ngIf="upload.state === 'invalid'" class="errors">
                <li *ngFor="let error of upload.validation.errors | keyvalue" class="message error">
                    {{error.value}}
                </li>
            </ul>

            <ul *ngIf="upload.state === 'error'" class="errors">
                <li *ngFor="let error of upload.response.errors" class="message error">
                    {{error}}
                </li>
            </ul>
        </div>

        <div class="col col-auto actions">

            <div class="btn-group">
                <app-ui--button (dispatch)="control.start()" [label]="'Upload'" [disabled]="upload.state !== 'queued'" *ngIf="upload.state !== 'error'">
                    <i class="icon-left icon-upload"></i>
                </app-ui--button>

                <app-ui--button (dispatch)="control.retry()" [label]="'Retry'" *ngIf="upload.state === 'error'">
                    <i class="icon-left icon-arrow-sync"></i>
                </app-ui--button>

                <app-ui--button (dispatch)="control.stop()" [label]="'Abort'">
                    <i class="icon-left icon-cancel-outline"></i>
                </app-ui--button>
            </div>
        </div>
    </div>
</ng-template>

<ng-container ...>
    <ngx-fileupload-item [template]="customTemplate" ...></ngx-fileupload-item>
</ng-container>
`;

export const SNIPPETS = {
    LISTING1: ItemTemplateSnippet,
    LISTING2: ItemTemplateSimpleSnippet
};
