import { TestBed } from '@angular/core/testing';

import { MupdfService } from './mupdf.service';

describe('MupdfService', () => {
  let service: MupdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MupdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
