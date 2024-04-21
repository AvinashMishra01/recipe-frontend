import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  constructor(private http: HttpClient) {}
  mainurl = 'http://localhost:3000';

  async getRecipes() {
    try {
      const resp = await this.http
        .get(this.mainurl + '/api/recipe')
        .toPromise()
        .then((res) => res);
      console.log(' in service ', resp);
      return resp;
    } catch (error: any) {
      return error;
    }
  }
  async getRecipeById(id: number) {
    try {
      const resp = await this.http
        .get(this.mainurl + '/api/recipe/' + id)
        .toPromise()
        .then((res: any) => {
          if (res && res.data) {
            console.log(' in service ', res);

            return res.data[0];
          }
        });

      return resp;
    } catch (error: any) {
      return error;
    }
  }

  async createRecipe(recipe: any) {
    try {
      let resp = await this.http
        .post(this.mainurl + '/api/recipe', recipe)
        .toPromise()
        .then((res: any) => {
          if (res && res.data) {
            console.log(' in service ', res);
            return res;
          } else {
            return res;
          }
        });
      return resp;
    } catch (error: any) {
      return error;
    }
  }

  async updateRecipe(recipe: any, id: number) {
    try {
      const resp = await this.http
        .put(this.mainurl + '/api/recipe/' + id, recipe)
        .toPromise()
        .then((res: any) => {
          if (res && res.data) {
            console.log(' in service ', res);
            return res;
          }
        });
      return resp;
    } catch (error: any) {
      return error;
    }
  }

  async deleteRecipe(id: number) {
    try {
      const resp = await this.http
        .delete(this.mainurl + '/api/recipe/' + id)
        .toPromise()
        .then((res: any) => {
          if (res && res?.data) {
            console.log(' in service ', res);
            return res.data;
          }
        });
      return resp;
    } catch (error: any) {
      return error;
    }
  }
}
