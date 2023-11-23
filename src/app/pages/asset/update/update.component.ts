import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Asset } from 'src/app/domain/asset';
import { AssetService } from 'src/app/service/asset.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {

  asset: Asset = new Asset();

  id: number;
  constructor(
    private assetService: AssetService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.id = data.id;
     }

    ngOnInit(): void {
      this.assetService.getAssetById(this.id).subscribe(data => {
        this.asset = data;
      }, error => console.log(error));
    }

  onSubmit(){
    this.assetService.updateAsset(this.id, this.asset).subscribe( data =>{
      this.goToAssetList();
    }
    , error => console.log(error));
  }

  goToAssetList(){
    this.router.navigate(['/admin/assets']);
    window.location.reload();

  }

}
