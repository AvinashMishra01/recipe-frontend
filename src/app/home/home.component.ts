import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { Router } from '@angular/router';
// table designe

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface RecipeData {
  id: number;
  date: Date;
  title: string;
  ingredients: string;
  instructions: string;
}

import Swal from 'sweetalert2';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'Id',
    'Title',
    'Ingredients',
    'Instructions',
    'Date',
    'Action',
  ];
  dataSource: MatTableDataSource<RecipeData> | any;

  constructor(private service: RecipeService, public router: Router) {}

  goToCreateTaskPage() {
    this.router.navigate(['/create']);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  recipes: any[] = [];
  errorMessage: string = '';

  async ngOnInit(): Promise<void> {
    await this.loadRecipes();
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  async loadRecipes() {
    try {
      let resp = await this.service.getRecipes();
      console.log('data is ', resp.data.length);

      if (resp.data.length > 0) {
        this.recipes = resp.data;
        console.log('data is ', this.recipes);
        this.dataSource = new MatTableDataSource(
          this.recipes.map((recipe) => ({
            id: recipe.id,
            title: recipe.recipe_name,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            date: recipe.date,
          }))
        );
        if (this.dataSource) {
          console.log('this isthe datasource ');
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      }
      if (resp?.data.length === 0) {
        Swal.fire({
          position: 'top-end',
          icon: 'info',
          title: 'No data present in Recipe list. Please create Recipe!',
          showConfirmButton: false,
          timer: 2000,
        });
        this.goToCreateTaskPage();
      }
    } catch (error) {
      this.errorMessage = 'Server is not responding. Please try again later.';
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Servier is not responding. Please try again later.',
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }

  deleteConfirmation(index: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          this.deleteTask(index);
        } catch (error) {
          console.error('Error deleting task:', error);
          Swal.fire(
            'Error!',
            'An error occurred while deleting the task.',
            'error'
          );
        }
      }
    });
  }

  async deleteTask(index: number) {
    try {
      let resp = await this.service.deleteRecipe(index);
      if (resp) {
        if (resp.error) {
          Swal.fire('Error', resp.error, 'error');
        } else {
          Swal.fire('Success', resp.data, 'success');
          this.loadRecipes();
        }
      } else {
        Swal.fire('Error', 'Something went wrong', 'error');
      }
    } catch (error) {
      Swal.fire('Warning', 'Server Down...!', 'warning');
    }
  }

  updateTask(toUpdateId: number) {
    console.log('id is ', toUpdateId);
    this.router.navigate(['/edit', toUpdateId]);
  }

  compliteConfirmation(toConpliteId: number) {
    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: "You want to complite this task!",
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: 'Yes, Complite it!'
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     try {
    //         this.compliteTask(toConpliteId);
    //         Swal.fire(
    //           'Complited!',
    //           'Your task has been complited.',
    //           'success'
    //         );
    //       } catch (error) {
    //         console.error('Error compliting task:', error);
    //         Swal.fire(
    //           'Error!',
    //           'An error occurred while compliting the task.',
    //           'error'
    //         );
    //       }
    //   }
    // })
  }

  //   compliteTask(toCompliteId: number): void {
  //     this.taskService.compliteTask(toCompliteId);
  //     this.loadTasks();
  //   }
}
