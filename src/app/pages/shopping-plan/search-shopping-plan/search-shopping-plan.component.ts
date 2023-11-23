import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Currency } from 'src/app/domain/Currency';
import { PlanList } from 'src/app/domain/PlanList';
import { PlanListDetail } from 'src/app/domain/PlanListDetail';
import { ProductType } from 'src/app/domain/ProductType';
import { ProductTypeDetail } from 'src/app/domain/ProductTypeDetail';
import { ShoppingPlan } from 'src/app/domain/ShoppingPlan';
import { Unit } from 'src/app/domain/Unit';
import { CurrencyService } from 'src/app/service/CurrencyService';
import { PlanListService } from 'src/app/service/PlanList.service';
import { PlanListDetailService } from 'src/app/service/PlanListDetail.service';
import { ProductTypeService } from 'src/app/service/ProductType.service';
import { ProductTypeDetailService } from 'src/app/service/ProductTypeDetail.service';
import { ShoppingPlanService } from 'src/app/service/ShoppingPlan.service';
import { UnitService } from 'src/app/service/UnitService';

@Component({
  selector: 'app-search-shopping-plan',
  templateUrl: './search-shopping-plan.component.html',
  styleUrls: ['./search-shopping-plan.component.css']
})
export class SearchShoppingPlanComponent implements OnInit {
  selectedYear: any;
  selectedUnitId: any;
  selectedCurrencyId: any;
  selectedProductTypeDetailId: any;
  planListOptions: PlanList[] | any = [];
  planListDetailOptions: PlanListDetail[] | any = [];
  selectedPlanDetailId: any;
  productTypeOptions: ProductType[] | any = [];
  productTypeDetailOptions: ProductTypeDetail[] | any = [];
  unitOptions: Unit[] | any = [];
  currencyOptions: Currency[] | any = [];
  selectedProductTypeId: any;
  shoppingPlanList: ShoppingPlan[] | any = [];


  constructor(
    private formBuilder: FormBuilder,
    private planListDetailService: PlanListDetailService,
    private planListService: PlanListService,
    private shoppingPlanService: ShoppingPlanService,
    private productTypeDetailService: ProductTypeDetailService,
    private productTypeService: ProductTypeService,
    private unitService: UnitService,
    private currencyService: CurrencyService,
    public dialogRef: MatDialogRef<SearchShoppingPlanComponent>
  ) {

    this.searchForm = this.formBuilder.group({
      productName: '',
      planList: '',
      planListDetail: '',
      productType: '',
      productTypeDetail: '',
      unit: '',
      currency: ''
    });

   }

  searchForm: FormGroup;
  
  ngOnInit(): void {
    this.loadPlanListOptions();
    this.loadProductTypeOptions();
    this.loadUnitOptions();
    this.loadCurrencyOptions();
  }

  onSubmit() {
    this.shoppingPlanService.advancedSearch(this.searchForm.value.productName, this.searchForm.value.planList, this.searchForm.value.planListDetail, this.searchForm.value.productType, this.searchForm.value.productTypeDetail, this.searchForm.value.unit, this.searchForm.value.currency)
      .subscribe((data) => {
        const shoppingPlanListFromAPI = data.content; 
        this.dialogRef.close({ shoppingPlanList: shoppingPlanListFromAPI });
      });
  }

  onYearChange(event: any) {
    this.selectedYear = event.target.value;
    this.planListDetailService
      .getPlansListDetailByYear(this.selectedYear)
      .subscribe((plans) => {
        this.planListDetailOptions = plans;
      });
  }
  
  loadPlanListOptions() {
    this.planListService.getAllPlanList().subscribe((data: any) => {
      this.planListOptions = Object.values(data);
      console.log(this.planListOptions);
    });
  }

  onProductTypeChange(event: any) {
    this.selectedProductTypeId = event.target.value;
    this.productTypeDetailService
      .getProductTypeDetailByType(this.selectedProductTypeId)
      .subscribe((typeDetails) => {
        this.productTypeDetailOptions = typeDetails;
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

}
