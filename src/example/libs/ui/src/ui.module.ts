import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgxFileUploadModule } from "@r-hannuschka/ngx-fileupload";
import { NgxCustomScrollbarModule } from "ngx-customscrollbar";

import { HeaderComponent } from "./header/header.component";
import { HeaderMenuComponent } from "./header-menu/header-menu.component";
import { RouterModule } from "@angular/router";
import { ButtonComponent } from "./button/button.component";
import { ProgressbarCircleComponent } from "./progressbar-circle/progressbar-circle.component";
import { UploadToolbarComponent } from "./upload-toolbar/upload-toolbar.component";
import { UploadItemSimpleComponent } from "./upload-item-simple/upload-item-simple.component";
import { IgxIconModule, IgxIconService } from "igniteui-angular";
import { UploadOverviewComponent } from "./upload-overview/upload-overview";
import { ProgressbarComponent } from "./progressbar/progressbar";

import * as Icons from "@ngx-fileupload-example/data/ui/icons";

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        NgxFileUploadModule,
        IgxIconModule,
        NgxCustomScrollbarModule
    ],
    exports: [
        ButtonComponent,
        HeaderComponent,
        ProgressbarCircleComponent,
        ProgressbarComponent,
        UploadToolbarComponent,
        UploadItemSimpleComponent,
        UploadOverviewComponent,
        NgxCustomScrollbarModule
    ],
    declarations: [
        ButtonComponent,
        HeaderComponent,
        HeaderMenuComponent,
        ProgressbarCircleComponent,
        UploadToolbarComponent,
        UploadItemSimpleComponent,
        UploadOverviewComponent,
        ProgressbarComponent
    ],
    providers: [],
})
export class UiModule {

    public constructor(iconService: IgxIconService) {
        iconService.addSvgIconFromText("github", Icons.GITHUB, "ngx-fileupload-icons");
        iconService.addSvgIconFromText("npm", Icons.NPM, "ngx-fileupload-icons");
    }
}
