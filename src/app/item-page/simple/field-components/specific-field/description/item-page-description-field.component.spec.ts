import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ItemPageDescriptionFieldComponent } from './item-page-description-field.component';
import { TranslateLoaderMock } from '../../../../../../../../app/shared/testing/translate-loader.mock';
import { SharedModule } from '../../../../../../../../app/shared/shared.module';
import { APP_CONFIG } from '../../../../../../../../config/app-config.interface';
import { environment } from '../../../../../../../../environments/environment';
import { By } from '@angular/platform-browser';

let comp: ItemPageDescriptionFieldComponent;
let fixture: ComponentFixture<ItemPageDescriptionFieldComponent>;

describe('ItemPageDescriptionFieldComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
        SharedModule,
      ],
      providers: [
        { provide: APP_CONFIG, useValue: environment },
      ],
      declarations: [ItemPageDescriptionFieldComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ItemPageDescriptionFieldComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {

    fixture = TestBed.createComponent(ItemPageDescriptionFieldComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should render a ds-metadata-values', () => {
    expect(fixture.debugElement.query(By.css('ds-metadata-values'))).toBeDefined();
  });
});
