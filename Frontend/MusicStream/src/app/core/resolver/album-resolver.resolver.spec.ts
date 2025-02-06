import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { albumResolverResolver } from './album-resolver.resolver';

describe('albumResolverResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => albumResolverResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
