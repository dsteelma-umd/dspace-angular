import { HttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { PaginationService } from 'ngx-pagination';
import { Observable, of as observableOf } from 'rxjs';
import { DSOChangeAnalyzer } from 'src/app/core/data/dso-change-analyzer.service';
import { AuthorizationDataService } from 'src/app/core/data/feature-authorization/authorization-data.service';
import { FeatureID } from 'src/app/core/data/feature-authorization/feature-id';
import { FindListOptions } from 'src/app/core/data/find-list-options.model';
import { buildPaginatedList, PaginatedList } from 'src/app/core/data/paginated-list.model';
import { RemoteData } from 'src/app/core/data/remote-data';
import { RequestService } from 'src/app/core/data/request.service';
import { Unit } from 'src/app/core/eperson/models/unit.model';
import { UnitDataService } from 'src/app/core/eperson/unit-data.service';
import { RouteService } from 'src/app/core/services/route.service';
import { PageInfo } from 'src/app/core/shared/page-info.model';
import { RouterMock } from 'src/app/shared/mocks/router.mock';
import { TranslateLoaderMock } from 'src/app/shared/mocks/translate-loader.mock';
import { createSuccessfulRemoteDataObject$ } from 'src/app/shared/remote-data.utils';
import { PaginationServiceStub } from 'src/app/shared/testing/pagination-service.stub';
import { routeServiceStub } from 'src/app/shared/testing/route-service.stub';
import { UnitMock } from 'src/app/shared/testing/unit-mock';

import { UnitsRegistryComponent } from './units-registry.component';

describe('UnitsRegistryComponent', () => {
  let component: UnitsRegistryComponent;
  let fixture: ComponentFixture<UnitsRegistryComponent>;
  let unitDataServiceStub: any;
  let authorizationService: AuthorizationDataService;
  let paginationService: any;

  /**
   * Set authorizationService.isAuthorized to return the following values.
   * @param isAdmin whether or not the current user is an admin.
   */
   const setIsAuthorized = (isAdmin: boolean) => {
    (authorizationService as any).isAuthorized.and.callFake((featureId?: FeatureID) => {
      switch (featureId) {
        case FeatureID.AdministratorOf:
          return observableOf(isAdmin);
        case FeatureID.CanDelete:
          return observableOf(true);
        default:
          throw new Error(`setIsAuthorized: this fake implementation does not support ${featureId}.`);
      }
    });
  };


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,
        TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      })],
    });
  });

  authorizationService = jasmine.createSpyObj('authorizationService', ['isAuthorized']);
  paginationService = new PaginationServiceStub();
  unitDataServiceStub = {
    searchUnits(query: string): Observable<RemoteData<PaginatedList<Unit>>> {
      switch (query) {
        case 'query_with_no_results':
          return createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo({
            elementsPerPage: 1,
            totalElements: 0,
            totalPages: 0,
            currentPage: 1
          }), []));
        case 'query_with_one_result':
          return createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo({
            elementsPerPage: 1,
            totalElements: 1,
            totalPages: 1,
            currentPage: 1
          }), [UnitMock]));
        }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitsRegistryComponent ],
      providers: [
        DSOChangeAnalyzer,
        { provide: UnitDataService, useValue: unitDataServiceStub },
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: PaginationService, useValue: paginationService },
        { provide: RouteService, useValue: routeServiceStub },
        { provide: Router, useValue: new RouterMock() },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitsRegistryComponent);
    component = fixture.componentInstance;
//    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('search', () => {
    describe('when searching with query', () => {
      beforeEach(fakeAsync(() => {
        setIsAuthorized(true);
      }));

      it('should display a message when no results are found', fakeAsync(() => {
          let unitIdsFound;
          component.search({ query: 'query_with_no_results'});
          tick();
          fixture.detectChanges();
          unitIdsFound = fixture.debugElement.queryAll(By.css('#units tr td:first-child'));

          expect(unitIdsFound.length).toEqual(0);
          expect(fixture.nativeElement.innerText).toContain('admin.access-control.units.no-items');
        }));

      it('should display search results when results are found', fakeAsync(() => {
        let unitIdsFound;
        component.search({ query: 'query_with_one_result'});
        tick();
        fixture.detectChanges();
        unitIdsFound = fixture.debugElement.queryAll(By.css('#units tr td:first-child'));

        expect(unitIdsFound.length).toEqual(1);
        expect(unitIdsFound.find((foundEl) => {
          return (foundEl.nativeElement.textContent.trim() === UnitMock.uuid);
        })).toBeTruthy();
      }));
    });
  });
});
