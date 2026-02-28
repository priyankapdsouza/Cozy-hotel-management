import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent implements OnInit {
  form: FormGroup;
  list: any[] = [];

  constructor(private fb: FormBuilder, private api: ApiService, public auth: AuthService) {
    this.form = this.fb.group({
      foodRating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      serviceRating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      ambianceRating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['']
    });
  }

  ngOnInit() {
    if (this.auth.isAdmin()) {
      this.api.getAllFeedback().subscribe(f => this.list = f);
    } else {
      this.api.getMyFeedback().subscribe(f => this.list = f);
    }
  }

  submit() {
    if (this.form.invalid) return;
    this.api.submitFeedback(this.form.value).subscribe({
      next: () => {
        this.form.reset({ foodRating: 5, serviceRating: 5, ambianceRating: 5 });
        this.api.getMyFeedback().subscribe(f => this.list = f);
      }
    });
  }
}
