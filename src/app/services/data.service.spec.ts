import { TestBed, inject } from '@angular/core/testing';

import { GraphService } from './data.service';

describe('GraphService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GraphService]
    });
  });

  it('should ...', inject([GraphService], (service: GraphService) => {
    expect(service).toBeTruthy();
  }));
});