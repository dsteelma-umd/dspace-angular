import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RestrictedAccessComponent } from './restricted-access/restricted-access.component';

/**
 * Routing module to help navigate Restricted Access pages
 */
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        // Resolve angular bitstream download URLs
        path: ':id',
        component: RestrictedAccessComponent,
        // resolve: {
        //   bitstream: BitstreamPageResolver
        // },
      },
      {
        path: '',
        component: RestrictedAccessComponent,
        // resolve: {
        //   bitstream: BitstreamPageResolver,
        // },
      }
    ])
  ],
})

export class RestrictedAccessPageRoutingModule {
}
