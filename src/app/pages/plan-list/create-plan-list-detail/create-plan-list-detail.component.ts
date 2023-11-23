import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PlanList } from 'src/app/domain/PlanList';
import { PlanListDetail } from 'src/app/domain/PlanListDetail';
import { PlanListService } from 'src/app/service/PlanList.service';
import { PlanListDetailService } from 'src/app/service/PlanListDetail.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-create-plan-list-detail',
  templateUrl: './create-plan-list-detail.component.html',
  styleUrls: ['./create-plan-list-detail.component.css']
})
export class CreatePlanListDetailComponent implements OnInit {

  planListDetail: PlanListDetail = new PlanListDetail();
  planListOptions:  PlanList[] | any = [];

  constructor(
    public dialogRef: MatDialogRef<CreatePlanListDetailComponent>,
    private planListDetailService: PlanListDetailService,
    private planListService: PlanListService,
    protected router: Router,
  ) { }

  ngOnInit(): void {
    this.loadPlanListOptions();
  }

  onSubmit(): void {
    this.save();
  }

  close(): void {
    this.dialogRef.close();
  }

  selectedPlanId: any;

  onPlanChange(event: any) {
    this.selectedPlanId = event.target.value;
  }

      // Lấy danh sách plan
      loadPlanListOptions() {
        this.planListService.getAllPlanList().subscribe((data: any) => {
          this.planListOptions = Object.values(data);
        });
      }

      
  save() {
    const data = {
      nameOfPlanList: this.planListDetail.nameOfPlanList,
      planListId: [parseInt(this.selectedPlanId)],
    };

    this.planListDetailService.createPlanListDetail(data).subscribe(
      (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Tạo danh sách thành công.',
        }).then(() => {
          this.router.navigate(['/admin/plan-list']);
          this.close();
          location.reload()
        });
      },
      (error) => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Thông tin không hợp lệ hoặc đã tồn tại.',
        });
      }
    );
  }
}
