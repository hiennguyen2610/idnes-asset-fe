import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Asset } from 'src/app/domain/asset';
import { AssetService } from 'src/app/service/asset.service';
import { CreateAssetComponent } from './create-asset/create-asset.component';
import { UpdateComponent } from './update/update.component';
import { PageEvent } from '@angular/material/paginator';
import { ShoppingPlanService } from 'src/app/service/ShoppingPlan.service';
import { PlanList } from 'src/app/domain/PlanList';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PlanListService } from 'src/app/service/PlanList.service';
import { Router, NavigationEnd } from '@angular/router';
import { PlanListDetailService } from 'src/app/service/PlanListDetail.service';
import { PlanListDetail } from 'src/app/domain/PlanListDetail';
import { ViewAssetModalComponent } from './view-asset-modal/view-asset-modal.component';
@Component({
  selector: 'app-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.css'],
})
export class AssetComponent implements OnInit {
  assetList: Asset[] | any = [];
  planListOptions: PlanList[] | any = [];
  searchForm: FormGroup;
  selectedPlan: string;
  pageIndex: number;
  pageSize: number;
  totalItems: any;
  selectedPlanDetailId: null;
  selectedYear: any;
  shoppingPlanList: any;
  planListDetailOptions: PlanListDetail[] | any = [];

  constructor(
    private assetService: AssetService,
    private shoppingPlanService: ShoppingPlanService,
    private planListService: PlanListService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private router: Router,
    private planListDetailService: PlanListDetailService
  ) {
    this.searchForm = this.formBuilder.group({
      itemCodeOrNameOrContractCode: '',
      type: 'hardware', // Giá trị mặc định
      planListId: null, // Giá trị mặc định
    });
  }

  // Tìm kiếm
  onSubmit(event: PageEvent) {
    // this.pageIndex = event.pageIndex;
    // this.pageSize = event.pageSize;
    // this.shoppingPlanService
    //   .search(
    //     this.searchForm.value.itemCodeOrNameOrContractCode,
    //     this.pageIndex,
    //     this.pageSize
    //   )
    //   .subscribe((data) => {
    //     this.assetList = data.content;
    //     this.totalItems = data.totalElements;
    //   });
  }

  // Lấy danh sách plan
  loadPlanListOptions() {
    this.planListService.getAllPlanList().subscribe((data: any) => {
      this.planListOptions = Object.values(data);
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

  onPlanChange(event: any) {
    // this.selectedPlanDetailId = event.target.value;
    // this.shoppingPlanService
    //   .getShoppingPlanByPlanListDetail(this.selectedPlanDetailId)
    //   .subscribe((plans: any) => {
    //     this.shoppingPlanList = plans;
    //   });
  }

  getPageEvent(): PageEvent {
    const pageEvent = new PageEvent();
    pageEvent.pageIndex = this.pageIndex;
    pageEvent.pageSize = this.pageSize;
    return pageEvent;
  }

  ngOnInit(): void {
    this.loadPlanListOptions();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        location.reload();
      }
    });

    // this.loadPlanListOptions();
    const initialPageEvent: PageEvent = {
      pageIndex: 0,
      pageSize: 5,
      length: 0,
    };
    this.onPageChange(initialPageEvent);
  }

  // Hiển thị danh sách có phân trang
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.assetService
      .getAssetList(this.pageIndex, this.pageSize)
      .subscribe((data) => {
        this.assetList = data.content;
        this.totalItems = data.totalElements;
        console.log(this.assetList);
      });
  }

  // Xóa sp
  deleteAsset(id: number) {
    console.log(id);
    const confirmed = window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?');
    if (confirmed) {
      // Gọi hàm xóa người dùng sau khi xác nhận
      this.assetService.deleteAsset(id).subscribe((data: any) => {
        console.log(data);
        // this.getAssetList();
      });
      window.location.reload();
      (error) => {
        window.location.reload();
        console.log('Lỗi ko xóa được');
      };
    }
  }

  // Open modal create asset
  openDialogCreateAsset(): void {
    const dialogRef = this.dialog.open(CreateAssetComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  updateAssetDialog(id: number): void {
    const dialogRef = this.dialog.open(UpdateComponent, {
      data: { id: id }, // Truyền giá trị id vào modal
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  viewAsset(id: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { id: id };

    const dialogRef = this.dialog.open(ViewAssetModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
