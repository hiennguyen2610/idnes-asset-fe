import { Component, DoCheck, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { PlanList } from 'src/app/domain/PlanList';
import { ShoppingPlan } from 'src/app/domain/ShoppingPlan';
import { PlanListService } from 'src/app/service/PlanList.service';
import { ShoppingPlanService } from 'src/app/service/ShoppingPlan.service';
import * as XLSX from 'xlsx';
import { LocalDate } from '@js-joda/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddToAssetComponent } from './add-to-asset/add-to-asset.component';
import { SearchShoppingPlanComponent } from './search-shopping-plan/search-shopping-plan.component';
import { CreateShoppingPlanComponent } from './create-shopping-plan/create-shopping-plan.component';
import { PlanListDetailService } from 'src/app/service/PlanListDetail.service';
import { PlanListDetail } from 'src/app/domain/PlanListDetail';
import { ViewAssetModalComponent } from '../asset/view-asset-modal/view-asset-modal.component';
import { AssetService } from 'src/app/service/asset.service';
import { UpdateShoppingPlanComponent } from './update-shopping-plan/update-shopping-plan.component';


@Component({
  selector: 'app-shopping-plan',
  templateUrl: './shopping-plan.component.html',
  styleUrls: ['./shopping-plan.component.css'],
})
export class ShoppingPlanComponent implements OnInit {
  shoppingPlanList: ShoppingPlan[] | any = [];
  shoppingPlanListNotPageable: ShoppingPlan[] | any = [];
  pageIndex: number;
  pageSize: number;
  totalItems: any;

  searchForm: FormGroup;
  planListOptions: PlanList[] | any = [];
  selectedPlan: string;
  userRole: string;
  selectedPlanDetailId: any;

  selectedYear: any;
  planListDetailOptions: PlanListDetail[] | any = [];

   initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 6,
    length: 0,
  };
  idPlanListDetail: any;
  idAsset: any;

  constructor(
    private shoppingPlanService: ShoppingPlanService,
    private planListService: PlanListService,
    private planListDetailService: PlanListDetailService,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private assetService: AssetService
  ) {
    this.searchForm = this.formBuilder.group({
      productName: ''
    });  

    this.userRole = localStorage.getItem('role');
  }

  ngOnInit(): void {
    this.loadPlanListOptions();

    this.searchForm = new FormGroup({
      productName: new FormControl('')
    });
  }

  getPageEvent(): PageEvent {
    const pageEvent = new PageEvent();
    pageEvent.pageIndex = this.pageIndex;
    pageEvent.pageSize = this.pageSize;
    return pageEvent;
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
    this.selectedPlanDetailId = event.target.value;
    const initialPageEvent: PageEvent = {
      pageIndex: 0,
      pageSize: 1,
      length: 0,
    };
    this.onPageChange(initialPageEvent, this.selectedPlanDetailId);
  }

  // Tìm kiếm theo tên sản phẩm
  onSubmit() {
    this.shoppingPlanService.searchByProductName(this.searchForm.value.productName)
      .subscribe((data) => {
        this.shoppingPlanList = data.content;
        this.totalItems = data.totalElements;
      });
  }

  // Hiển thị danh sách có phân trang


  onPageChange(event: PageEvent, selectedPlanDetailId: number) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.shoppingPlanService
      .getShoppingPlanByPlanListDetail(this.pageIndex, this.pageSize, selectedPlanDetailId)
      .subscribe((data) => {
        this.shoppingPlanList = data.content;
        this.totalItems = data.totalElements;
      });
  }

  viewAsset(id: any) {
    this.assetService.getAssetIdByShoppingPlanId(id).subscribe((data) => {
        this.idAsset = data;
    });
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { id: this.idAsset };

    const dialogRef = this.dialog.open(ViewAssetModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
  

  // Xóa sp
  deleteShoppingPlan(id: number) {
    Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
      text: 'Hành động này sẽ xóa sản phẩm và không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        this.shoppingPlanService.deleteShoppingPlan(id).subscribe(
          (data: any) => {
            console.log(data);
            Swal.fire('Xóa thành công!', 'Sản phẩm đã được xóa.', 'success');
            setTimeout(() => {
              window.location.reload();
            }, 2000); // 2000 ms = 2 giây
          },
          (error) => {
            Swal.fire('Lỗi!', 'Không thể xóa sản phẩm.', 'error');
          }
        );
      }
    });
  }
  

  // Chuyển status sang pending
  changeProductStatusToPending(id: number) {
    Swal.fire({
      title: 'Xác nhận gửi yêu cầu',
      text: 'Bạn có muốn gửi yêu cầu phê duyệt sản phẩm này cho quản trị viên?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        this.shoppingPlanService.changeProductStatusToPending(id).subscribe(
          (data: any) => {
            Swal.fire('Gửi yêu cầu thành công!', 'Yêu cầu đã được gửi.', 'success');
            this.router.navigate(['/admin/shopping-plan']);
            setTimeout(() => {
              window.location.reload();
            }, 2000); // 2000 ms = 2 giây
          },
          (error) => {
            Swal.fire('Lỗi!', 'Không thể gửi yêu cầu.', 'error');
          }
        );
      }
    });
  }
  

  // Chuyển status sang approved với quyền admin
  changeProductStatusToApproved(id: number) {
    Swal.fire({
      title: 'Xác nhận phê duyệt sản phẩm',
      text: 'Bạn có muốn phê duyệt sản phẩm này?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        this.shoppingPlanService.changeProductStatusToApproved(id).subscribe(
          (data: any) => {
            Swal.fire('Phê duyệt thành công!', 'Sản phẩm đã được phê duyệt.', 'success');
            this.router.navigate(['/admin/shopping-plan']);
            setTimeout(() => {
              window.location.reload();
            }, 2000); // 2000 ms = 2 giây
          },
          (error) => {
            Swal.fire('Lỗi!', 'Không thể phê duyệt sản phẩm.', 'error');
          }
        );
      }
    });
  }
  

  // Chuyển status sang cancelled với quyền admin
  changeProductStatusToCancelled(id: number) {
    Swal.fire({
      title: 'Xác nhận hủy sản phẩm',
      text: 'Bạn có muốn hủy sản phẩm này?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        this.shoppingPlanService.changeProductStatusToCancelled(id).subscribe(
          (data: any) => {
            Swal.fire('Hủy thành công!', 'Sản phẩm đã được hủy.', 'success');
            setTimeout(() => {
              window.location.reload();
            }, 2000); // 2000 ms = 2 giây
          },
          (error) => {
            Swal.fire('Lỗi!', 'Không thể hủy sản phẩm.', 'error');
          }
        );
      }
    });
  }
  


  changeProductStatusToDone(id: number): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { productId: id };

    const dialogRef = this.dialog.open(AddToAssetComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
    });

  }


  // Lấy danh sách plan
  loadPlanListOptions() {
    this.planListService.getAllPlanList().subscribe((data: any) => {
      this.planListOptions = Object.values(data);
      console.log(this.planListOptions);
    });
  }

  // Xuất excel
  exportToExcel() {
    // this.shoppingPlanService.getAllShoppingPlans().subscribe((data: any) => {
    //   this.shoppingPlanListNotPageable = data;
    //   console.log(data);

    //   // Chọn các trường muốn xuất
    //   const selectedFields = data.map((item) => ({
    //     'Số hiệu': item.id,
    //     'Mã sản phẩm': item.itemCode,
    //     'Tên hàng hóa': item.productName,
    //     'Loại hàng hóa/dịch vụ': item.assetType,
    //     'Đơn vị': item.unit,
    //     'Loại tiền': item.currency,
    //     'Thời hạn kí (tháng)': item.contractDuration,
    //     'Số lượng': item.quantity,
    //     'Đơn giá dự kiến': item.price,
    //     'Thành tiền': item.quantity * item.price,
    //     'Trạng thái': item.status,
    //     'Ngày kết thúc bảo hành': this.formatLocalDate(
    //       item.warrantyExpirationDate
    //     ),
    //     'Ngày yêu cầu giao hàng': this.formatLocalDate(
    //       item.deliveryRequestDate
    //     ),
    //     'Ngày bàn giao': this.formatLocalDate(item.deliveryDate),
    //     'Ngày renew dịch vụ thiết bị': this.formatLocalDate(
    //       item.equipmentServiceReplacementDate
    //     ),
    //     'Mã hợp đồng': item.contractCode,
    //     'Ghi chú': item.description,
    //     'Mã nhà cung cấp': item.supplierCode,
    //     'Nhà cung cấp': item.supplier,
    //     'Hãng sản xuất': item.productOrigin,
    //     Năm: this.formatPlanLists(item.planLists),
    //   }));

    //   const worksheet: XLSX.WorkSheet =
    //     XLSX.utils.json_to_sheet(selectedFields);

    //   // Đặt tên các cột trong file Excel
    //   worksheet.A1.v = 'Số hiệu';
    //   worksheet.B1.v = 'Mã sản phẩm';
    //   worksheet.C1.v = 'Tên hàng hóa';
    //   worksheet.D1.v = 'Loại hàng hóa/dịch vụ';
    //   worksheet.E1.v = 'Đơn vị';
    //   worksheet.F1.v = 'Loại tiền';
    //   worksheet.G1.v = 'Thời hạn kí (tháng)';
    //   worksheet.H1.v = 'Số lượng';
    //   worksheet.I1.v = 'Đơn giá dự kiến';
    //   worksheet.J1.v = 'Thành tiền';
    //   worksheet.K1.v = 'Trạng thái';
    //   worksheet.L1.v = 'Ngày kết thúc bảo hành';
    //   worksheet.M1.v = 'Ngày yêu cầu giao hàng';
    //   worksheet.N1.v = 'Ngày bàn giao';
    //   worksheet.O1.v = 'Ngày renew dịch vụ thiết bị';
    //   worksheet.P1.v = 'Mã hợp đồng';
    //   worksheet.Q1.v = 'Ghi chú';
    //   worksheet.R1.v = 'Mã nhà cung cấp';
    //   worksheet.S1.v = 'Nhà cung cấp';
    //   worksheet.T1.v = 'Hãng sản xuất';
    //   worksheet.U1.v = 'Năm';

    //   const workbook: XLSX.WorkBook = {
    //     Sheets: { data: worksheet },
    //     SheetNames: ['data'],
    //   };
    //   const excelBuffer: any = XLSX.write(workbook, {
    //     bookType: 'xlsx',
    //     type: 'array',
    //   });

    //   this.saveAsExcelFile(excelBuffer, 'shopping_plan');
    // });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const a: HTMLAnchorElement = document.createElement('a');
    const url: string = window.URL.createObjectURL(data);
    a.href = url;
    a.download = fileName + '.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }


  openDialogSearch(): void {
    const dialogRef = this.dialog.open(SearchShoppingPlanComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      this.shoppingPlanList = result.shoppingPlanList;
    });
  }

  openDialogCreateShoppingPlan(): void {
    const dialogRef = this.dialog.open(CreateShoppingPlanComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


  openDialogUpdate(id: number): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { id: id };

    const dialogRef = this.dialog.open(UpdateShoppingPlanComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
    });

  }


  // Format ngày tháng năm
  formatLocalDate(localDate: LocalDate) {
    if (localDate) {
      const formattedDate = localDate.toString();
      return formattedDate;
    } else {
      return '';
    }
  }

  formatPlanLists(planLists) {
    if (planLists && planLists.length > 0) {
      return planLists.map((plan) => plan.name).join(', ');
    } else {
      return '';
    }
  }


}
