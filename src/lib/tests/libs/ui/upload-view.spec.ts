import { ComponentFixture, async, TestBed, inject } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CommonModule } from "@angular/common";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

import {
    UploadStorage,
    UploadViewComponent,
    UploadItemComponent,
    UploadToolbarComponent,
    CancelAblePipe,
    StateToStringPipe,
    FileSizePipe,
    NgxFileUploadFactory
} from "@r-hannuschka/ngx-fileupload";
import { NgxFileuploadFactoryMock, UploadStorageMock } from "../../mockup";

describe( "Upload Component:", () => {

    let fixture: ComponentFixture<UploadViewComponent>;
    let testComponent: UploadViewComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule( {
            imports: [
                CommonModule,
                NoopAnimationsModule,
                HttpClientTestingModule
            ],
            declarations: [
                UploadViewComponent,
                UploadItemComponent,
                UploadToolbarComponent,
                CancelAblePipe,
                StateToStringPipe,
                FileSizePipe
            ],
            providers: [{
                provide: NgxFileUploadFactory,
                useClass: NgxFileuploadFactoryMock
            }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UploadViewComponent);
        testComponent = fixture.componentInstance;
    });

    it("should create an upload storage if no one is passed", () => {
        fixture.detectChanges();

        expect(testComponent.uploadStorage).not.toBeUndefined();
        expect(testComponent.uploadStorage instanceof UploadStorage).toBeTruthy();
    });

    it( "should call UploadFactory empty files array is dropped", inject(
        [NgxFileUploadFactory], (factory: NgxFileuploadFactoryMock
    ) => {
        const spy = spyOn(factory, "createUploadRequest").and.callThrough();
        const file = new File(["hello unit test"], "upload.txt");

        fixture.detectChanges();
        testComponent.dropFiles([file]);

        expect(spy).toHaveBeenCalled();
    }));

    it( "should not call UploadFactory empty files array is dropped", inject(
        [NgxFileUploadFactory], (factory: NgxFileuploadFactoryMock
    ) => {
        const spy = spyOn(factory, "createUploadRequest").and.callThrough();
        fixture.detectChanges();
        testComponent.dropFiles([]);
        expect(spy).not.toHaveBeenCalled();
    }));

    it( "should not create own storage if one is passed", () => {
        const fakeStorage = new UploadStorageMock();
        testComponent.storage = fakeStorage;
        fixture.detectChanges();

        expect(testComponent.uploadStorage).toBe(fakeStorage);
    });
});
