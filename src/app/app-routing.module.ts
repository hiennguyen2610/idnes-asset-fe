import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersComponent } from './pages/users/users.component';
import { AssetComponent } from './pages/asset/asset.component';
import { AuthGuard } from './authentication/auth.guard';
import { ListAssetComponent } from './pages/user_view/list-asset/list-asset.component';
import { ShoppingPlanComponent } from './pages/shopping-plan/shopping-plan.component';
import { CreateShoppingPlanComponent } from './pages/shopping-plan/create-shopping-plan/create-shopping-plan.component';
import { CreateAssetComponent } from './pages/asset/create-asset/create-asset.component';
import { UpdateShoppingPlanComponent } from './pages/shopping-plan/update-shopping-plan/update-shopping-plan.component';
import { UnitComponent } from './pages/unit/unit.component';
import { PlanListComponent } from './pages/plan-list/plan-list.component';
import { SupplierComponent } from './pages/supplier/supplier.component';
import { ProductTypeComponent } from './pages/product-type/product-type.component';
import { CurrencyComponent } from './pages/currency/currency.component';


const routes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "user/list-asset", component: ListAssetComponent },
  {
    path: "admin",
    component: AdminLayoutComponent,
    
    children: [
      { path: "dashboard", component: DashboardComponent },
      { path: "users", component: UsersComponent },
      { path: "assets", component: AssetComponent },
      { path: "shopping-plan", component: ShoppingPlanComponent },
      { path: "units", component: UnitComponent },
      { path: "plan-list", component: PlanListComponent },
      { path: "suppliers", component: SupplierComponent },
      { path: "create-shopping-plan", component: CreateShoppingPlanComponent },
      { path: "create-asset", component: CreateAssetComponent },
      { path: "update-shopping-plan/:id", component: UpdateShoppingPlanComponent },
      { path: "product-types", component: ProductTypeComponent },
      { path: "currencies", component: CurrencyComponent },
    ],
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
