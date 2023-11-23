import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PlanList } from 'src/app/domain/PlanList';
import { Asset } from 'src/app/domain/asset';
import { AssetService } from 'src/app/service/asset.service';
import { PlanListService } from 'src/app/service/PlanList.service';

@Component({
  selector: 'app-create-asset',
  templateUrl: './create-asset.component.html',
  styleUrls: ['./create-asset.component.css']
})
export class CreateAssetComponent implements OnInit {

  asset: Asset = new Asset();

  createAsset: FormGroup;
  
  planListOptions:  PlanList[] | any = [];
  
  constructor(
    private assetService: AssetService,
    protected router: Router,
    private formBuilder: FormBuilder,
    private planListService: PlanListService,
  ) { 
    this.createAsset = this.formBuilder.group({
      planListId: this.formBuilder.array([]),
      productCode: [''],
      productName: [''],
      type: [''],
      unit: [''],
      currency: [''],
      contractDuration: [''],
      quantity: [''],
      price: [''],
      contractCode: [''],
      supplierCode: [''],
      supplier: [''],
      productOrigin: [''],
      description: [''],
      warrantyExpirationDate: [''],
      deliveryRequestDate: [''],
      equipmentServiceReplacementDate: [''],
    });

  }

  ngOnInit(): void {
    // this.loadPlanListOptions();
  }

  // Sự kiện khi click vào tạo mới sản phẩm
  // onSubmit() {
  //   console.log(this.asset);
  //   this.saveAsset();
  // }

  onSubmit() {
    if (this.createAsset.valid) {
      const newAssetData = this.createAsset.value;
      console.log('Dữ liệu tài sản mới:', newAssetData);
      this.saveAsset(newAssetData);
    } else {
      console.log("lỗi k tạo")
    }
  }

  saveAsset(newAssetData: any) {
    this.assetService.createAsset(newAssetData).subscribe(
      (data) => {
        window.location.reload();
      },
      (error) => console.log(error)
    );
  }

  goToUserList() {
    window.location.reload();
  }

  // loadPlanListOptions() {
  //   this.planListService.getAllPlanList().subscribe((data: any) => {
  //     this.planListOptions = Object.values(data);
  //     console.log(this.planListOptions)
  //   });
  // }
}
