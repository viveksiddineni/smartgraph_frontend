import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadButtonComponent } from './download-button.component';
import {LoadingService} from '../services/loading.service';
import {NodeService} from '../d3/models/node.service';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../assets/material/material.module';
import {LinkService} from '../d3/models/link.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MessageService} from '../services/message.service';
import { ConfigService } from '../services/config.service';
import { DataConnectionService } from '../services/data-connection.service';

describe('DownloadButtonComponent', () => {
  let component: DownloadButtonComponent;
  let fixture: ComponentFixture<DownloadButtonComponent>;

  // Mock ConfigService
  const mockConfigService = {
    get: jasmine.createSpy('get').and.returnValue('ws://localhost:1234/socket')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadButtonComponent ],
      imports: [
        ReactiveFormsModule,
        MaterialModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: ConfigService, useValue: mockConfigService },  // Provide the mock
        DataConnectionService,
        MessageService,
        NodeService,
        LinkService,
        LoadingService
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
        CUSTOM_ELEMENTS_SCHEMA
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
