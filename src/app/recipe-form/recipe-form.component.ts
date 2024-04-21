import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { RecipeService } from '../recipe.service';

export interface Recipe {
  // id: number;
  recipe_name: string;
  ingredients: string;
  instructions: string;
  // date: Date;
}

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css'],
})
export class RecipeFormComponent implements OnInit {
  constructor(
    // private formBuilder: FormBuilder,
    private service: RecipeService,
    public router: Router,
    public routes: ActivatedRoute,
    public location: Location
  ) {}

  recipeForm!: FormGroup;
  recipesId: number = 0;
  updateIsClicked: boolean = false;

  async ngOnInit(): Promise<void> {
    this.recipeForm = new FormGroup({
      recipe_name: new FormControl('', [Validators.required]),
      ingredients: new FormControl('', [Validators.required]),
      instructions: new FormControl('', [Validators.required]),
    });

    this.recipesId = +this.routes?.snapshot.paramMap.get('id')!;
    if (this.recipesId != 0) {
      const recipes = await this.service.getRecipeById(this.recipesId);
      console.log('Update data roe ', recipes);

      this.updateIsClicked = true;
      this.recipeForm.patchValue({
        recipe_name: recipes.recipe_name,
        ingredients: recipes.ingredients,
        instructions: recipes.instructions,
      });
    }
  }

  goBack() {
    this.location.back();
  }
  async generateRandom5DigitNumber() {
    const randomNumber = Math.floor(Math.random() * 90000) + 10000;
    return randomNumber;
  }

  async onSubmit() {
    if (this.recipeForm.valid) {
      const formValue = this.recipeForm.value;
      console.log('Form submitted successfully.', formValue);
      let resp = await this.service.createRecipe(formValue);
      if (resp && resp.data) {
        if (resp.error) {
          Swal.fire('Error', resp.data, 'error');
        } else {
          Swal.fire('Success', resp.data, 'success');
          this.recipeForm.reset();
          this.router.navigate(['/home']);
        }
      } else {
        Swal.fire('Error', 'Something went wrong', 'error');
      }
    } else {
      console.log('Form has errors. Please fix them.');
      Swal.fire('Warning!', 'Please fill all the fields', 'warning');
    }
  }

  async onUpdate() {
    if (this.recipeForm.valid) {
      const formValue = this.recipeForm.value;
      let resp = await this.service.updateRecipe(formValue, this.recipesId);
      console.log('resp is ', resp);
      console.log('resp is ', resp.data);
      if (resp) {
        if (resp.error) {
          Swal.fire('Error', resp.data, 'error');
        } else {
          Swal.fire('Success', resp.data, 'success');
          this.router.navigate(['/home']);
        }
      } else {
        Swal.fire('Error', 'Something went wrong', 'error');
      }
    } else {
      console.log('Form has errors. Please fix them.');
      Swal.fire('Error!', 'Please fill all the fields', 'warning');
    }
  }
}
