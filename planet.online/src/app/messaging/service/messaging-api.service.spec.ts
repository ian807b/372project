import { TestBed } from '@angular/core/testing';

import { MessagingApiService } from './messaging-api.service';

describe('MessagingApiService', () => {
  let service: MessagingApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessagingApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
