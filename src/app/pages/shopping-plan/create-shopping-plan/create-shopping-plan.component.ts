import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlanList } from 'src/app/domain/PlanList';
import { ShoppingPlan } from 'src/app/domain/ShoppingPlan';
import { ShoppingPlanService } from 'src/app/service/ShoppingPlan.service';
import { PlanListService } from 'src/app/service/PlanList.service';
import { FormGroup } from '@angular/forms';
import { PlanListDetail } from 'src/app/domain/PlanListDetail';
import { PlanListDetailService } from 'src/app/service/PlanListDetail.service';
import { ProductTypeDetailService } from 'src/app/service/ProductTypeDetail.service';
import { ProductTypeDetail } from 'src/app/domain/ProductTypeDetail';
import { ProductType } from 'src/app/domain/ProductType';
import { ProductTypeService } from 'src/app/service/ProductType.service';
import { Unit } from 'src/app/domain/Unit';
import { Currency } from 'src/app/domain/Currency';
import { UnitService } from 'src/app/service/UnitService';
import { CurrencyService } from 'src/app/service/CurrencyService';
import Swal from 'sweetalert2';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-shopping-plan',
  templateUrl: './create-shopping-plan.component.html',
  styleUrls: ['./create-shopping-plan.component.css'],
})
export class CreateShoppingPlanComponent implements OnInit {
  myGroup: FormGroup;
  selectedProductTypeId: any;
  selectedUnitId: any;
  selectedCurrencyId: any;
  selectedProductTypeDetailId: any;
  selectedYear: any;
  selectedPlanDetailId: any;

  constructor(
    public dialogRef: MatDialogRef<CreateShoppingPlanComponent>,
    private shoppingPlanService: ShoppingPlanService,
    private planListService: PlanListService,
    protected router: Router,
    private planListDetailService: PlanListDetailService,
    private productTypeDetailService: ProductTypeDetailService,
    private productTypeService: ProductTypeService,
    private unitService: UnitService,
    private currencyService: CurrencyService
  ) {}

  ngOnInit(): void {
    this.loadPlanListOptions();
    this.loadProductTypeOptions();
    this.loadUnitOptions();
    this.loadCurrencyOptions();
  }

  shoppingPlan: ShoppingPlan = new ShoppingPlan();

  planListOptions: PlanList[] | any = [];
  planListDetailOptions: PlanListDetail[] | any = [];
  productTypeOptions: ProductType[] | any = [];
  productTypeDetailOptions: ProductTypeDetail[] | any = [];
  unitOptions: Unit[] | any = [];
  currencyOptions: Currency[] | any = [];

  onSubmit() {
    this.createShoppingPlan();
  }

  createShoppingPlan() {
    const data = {
      productName: this.shoppingPlan.productName,
      productTypeDetailId: [parseInt(this.selectedProductTypeId)],
      unitId: [parseInt(this.selectedUnitId)],
      currencyId: [parseInt(this.selectedCurrencyId)],
      quantity: this.shoppingPlan.quantity,
      description: this.shoppingPlan.description,
      planListDetailId: [parseInt(this.selectedPlanDetailId)],
    };
    console.log(data);
    this.shoppingPlanService.createShoppingPlan(data).subscribe(
      (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Kế hoạch đã được lưu thành công.',
        }).then(() => {
          this.dialogRef.close();
          location.reload()
        });
      },
      (error) => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Thông tin không hợp lệ.',
        });
      }
    );
  }

  close(): void {
    this.dialogRef.close();
  }

  onPlanChange(event: any) {
    this.selectedPlanDetailId = event.target.value;
  }

  onProductTypeChange(event: any) {
    this.selectedProductTypeId = event.target.value;
    this.productTypeDetailService
      .getProductTypeDetailByType(this.selectedProductTypeId)
      .subscribe((typeDetails) => {
        this.productTypeDetailOptions = typeDetails;
      });
  }

  onProductTypeDetailChange(event: any) {
    this.selectedProductTypeDetailId = event.target.value;
  }

  onUnitChange(event: any) {
    this.selectedUnitId = event.target.value;
  }

  onCurrencyChange(event: any) {
    this.selectedCurrencyId = event.target.value;
  }

  goToShoppingPlanList() {
    this.router.navigate(['/admin/shopping-plan']);
    window.location.reload();
  }

  onYearChange(event: any) {
    this.selectedYear = event.target.value;
    this.planListDetailService
      .getPlansListDetailByYear(this.selectedYear)
      .subscribe((plans) => {
        this.planListDetailOptions = plans;
      });
  }

  // Lấy danh sách plan
  loadPlanListOptions() {
    this.planListService.getAllPlanList().subscribe((data: any) => {
      this.planListOptions = Object.values(data);
    });
  }

  // Lấy danh sách product type
  loadProductTypeOptions() {
    this.productTypeService.getAllProductType().subscribe((data: any) => {
      this.productTypeOptions = Object.values(data);
    });
  }

  // Lấy danh sách đơn vị tính
  loadUnitOptions(){
    this.unitService.getAllUnit().subscribe((data: any) => {
      this.unitOptions = Object.values(data);
    });
  }

  // Lấy danh sách tiền tệ
  loadCurrencyOptions(){
    this.currencyService.getAllCurrency().subscribe((data: any) => {
      this.currencyOptions = Object.values(data);
    });
  }

  isButtonDisabled(): boolean {
    return (
      !this.selectedYear ||
      !this.selectedPlanDetailId ||
      !this.shoppingPlan.productName ||
      !this.selectedProductTypeId ||
      !this.selectedProductTypeDetailId ||
      !this.shoppingPlan.quantity ||
      !this.selectedUnitId ||
      !this.shoppingPlan.description ||
      !this.selectedCurrencyId
    );
  }
}
