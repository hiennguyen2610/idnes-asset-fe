import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Asset } from 'src/app/domain/asset';
import { AssetService } from 'src/app/service/asset.service';

@Component({
  selector: 'app-view-asset-modal',
  templateUrl: './view-asset-modal.component.html',
  styleUrls: ['./view-asset-modal.component.css']
})
export class ViewAssetModalComponent implements OnInit {

  id: any
  asset: Asset[] | any = []

  constructor(
    public dialogRef: MatDialogRef<ViewAssetModalComponent>,
    private assetService: AssetService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.id = data.id
    }

  ngOnInit(): void {
    this.assetService.getAssetById(this.id).subscribe(data => {
      this.asset = data;
      console.log(data)
    }, error => console.log(error));
  }

  preventClick(event: Event): void {
    event.preventDefault();
  }


}
