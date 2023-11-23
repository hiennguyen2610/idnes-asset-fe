import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanList } from 'src/app/domain/PlanList';
import { ShoppingPlanService } from 'src/app/service/ShoppingPlan.service';
import { PlanListService } from 'src/app/service/PlanList.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PlanListDetail } from 'src/app/domain/PlanListDetail';
import { Currency } from 'src/app/domain/Currency';
import { ProductType } from 'src/app/domain/ProductType';
import { ProductTypeDetail } from 'src/app/domain/ProductTypeDetail';
import { Unit } from 'src/app/domain/Unit';
import { CurrencyService } from 'src/app/service/CurrencyService';
import { PlanListDetailService } from 'src/app/service/PlanListDetail.service';
import { ProductTypeService } from 'src/app/service/ProductType.service';
import { ProductTypeDetailService } from 'src/app/service/ProductTypeDetail.service';
import { UnitService } from 'src/app/service/UnitService';
import { ShoppingPlan } from 'src/app/domain/ShoppingPlan';
import { ShoppingPlanHistory } from 'src/app/domain/ShoppingPlanHistory';

@Component({
  selector: 'app-update-shopping-plan',
  templateUrl: './update-shopping-plan.component.html',
  styleUrls: ['./update-shopping-plan.component.css'],
})
export class UpdateShoppingPlanComponent implements OnInit {
  shoppingPlan: ShoppingPlan[] | any = [];
  id: number;
  selectedPlanId: any;
  activeTab: string = 'update';
  shoppingPlanHistory: ShoppingPlanHistory[] | any = [];

  selectedProductTypeId: any;
  selectedUnitId: any;
  selectedCurrencyId: any;
  selectedProductTypeDetailId: any;
  selectedYear: any;
  selectedPlanDetailId: any;
  selectedVer: any;
  planListOptions: PlanList[] | any = [];
  planListDetailOptions: PlanListDetail[] | any = [];
  productTypeOptions: ProductType[] | any = [];
  productTypeDetailOptions: ProductTypeDetail[] | any = [];
  unitOptions: Unit[] | any = [];
  currencyOptions: Currency[] | any = [];
  versions: any[];

  constructor(
    private shoppingPlanService: ShoppingPlanService,
    private route: ActivatedRoute,
    private router: Router,
    private planListService: PlanListService,
    public dialogRef: MatDialogRef<UpdateShoppingPlanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private planListDetailService: PlanListDetailService,
    private productTypeDetailService: ProductTypeDetailService,
    private productTypeService: ProductTypeService,
    private unitService: UnitService,
    private currencyService: CurrencyService
  ) {
    this.id = data.id;
  }

  ngOnInit(): void {
    this.shoppingPlanService
      .getShoppingPlan(this.id)
      .subscribe((result) => {
        this.shoppingPlan = result;
        console.log(this.shoppingPlan);
      });
    // this.loadPlanListOptions();

    // this.shoppingPlanService.getShoppingPlanById(id).subscribe((result: any) => {
    //   this.data = result;
    //   // Chuyển mảng thành chuỗi
    //   this.warrantyExpirationDate = result.warrantyExpirationDate.map(num => num.toString()).join('-');
    //   this.deliveryRequestDate = result.deliveryRequestDate.map(num => num.toString()).join('-');
    //   this.equipmentServiceReplacementDate = result.equipmentServiceReplacementDate.map(num => num.toString()).join('-');
    // });

    this.loadPlanListOptions();
    this.loadProductTypeOptions();
    this.loadUnitOptions();
    this.loadCurrencyOptions();
    this.loadVersionOptions();
  }

  onSubmit(): void {
    this.updateShoppingPlan();
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

  onYearChange(event: any) {
    this.selectedYear = event.target.value;
    this.planListDetailService
      .getPlansListDetailByYear(this.selectedYear)
      .subscribe((plans) => {
        this.planListDetailOptions = plans;
      });
  }

  updateShoppingPlan() {
    const data = {
      itemCode: this.data.itemCode,
      productName: this.data.productName,
      assetType: this.data.assetType,
      unit: this.data.assetType,
      currency: this.data.currency,
      contractDuration: this.data.contractDuration,
      quantity: this.data.quantity,
      price: this.data.price,
      warrantyExpirationDate: this.data.warrantyExpirationDate,
      deliveryRequestDate: this.data.deliveryRequestDate,
      contractCode: this.data.contractCode,
      equipmentServiceReplacementDate:
        this.data.equipmentServiceReplacementDate,
      description: this.data.description,
      supplierCode: this.data.supplierCode,
      supplier: this.data.supplier,
      productOrigin: this.data.productOrigin,
      planListId: [parseInt(this.selectedPlanId)],
    };
    console.log(data);
    console.log(data);

    this.shoppingPlanService.updateShoppingPlan(this.data.id, data).subscribe(
      (data) => {
        console.log(data);
      },
      (error) => console.log(error)
    );
    this.goToShoppingPlanList();
  }

  goToShoppingPlanList() {
    this.router.navigate(['/admin/shopping-plan']);
    window.location.reload();
  }

  onPlanChange(event: any) {
    this.selectedPlanId = event.target.value;
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
  loadUnitOptions() {
    this.unitService.getAllUnit().subscribe((data: any) => {
      this.unitOptions = Object.values(data);
    });
  }

  // Lấy danh sách tiền tệ
  loadCurrencyOptions() {
    this.currencyService.getAllCurrency().subscribe((data: any) => {
      this.currencyOptions = Object.values(data);
    });
  }

  // Lấy danh sách version
  loadVersionOptions() {
    this.shoppingPlanService
      .getAllVersionByShoppingPlan(this.id)
      .subscribe((data: any) => {
        this.versions = data;
        console.log(this.versions);
      });
  }


  // Lấy lịch sử cập nhật by shoppingPlan
  selectedVersion(event: any) {
    this.selectedVer = event.target.value;
    this.shoppingPlanService
      .getShoppingPlanUpdatedHistoryByVersion(this.id, this.selectedVer)
      .subscribe((data: any) => {
        this.shoppingPlanHistory = data;
    console.log(this.shoppingPlanHistory)

      });
  }
}
