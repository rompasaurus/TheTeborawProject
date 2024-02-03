import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { memberDetailResolver } from './member-detail.resolver';
import { Member } from '../_models/member';

describe('memberDetailResolver', () => {
  const executeResolver: ResolveFn<Member> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => memberDetailResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
