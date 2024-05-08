import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicTreeComponent } from './topic-tree.component';

describe('TopicTreeComponent', () => {
  let component: TopicTreeComponent;
  let fixture: ComponentFixture<TopicTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopicTreeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TopicTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
