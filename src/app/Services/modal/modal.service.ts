import { Injectable, Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModalConfig } from '../../Models/Shared/models';
import { ModalAttributes } from '../../utils/app.const';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private configs: ModalConfig = {
    componentRef: null as unknown as Type<any>,
    attributes: ModalAttributes,
    inputs: {},
    isClose: true
  };

  public onCloseModalSubject = new BehaviorSubject<boolean>(false);
  public onCloseModal$ = this.onCloseModalSubject.asObservable();

  private modalConfig = new BehaviorSubject<ModalConfig>(this.configs);
  public modalConfig$ = this.modalConfig.asObservable();

  setModalConfigs(configs: ModalConfig) {
    if (configs.componentRef) {
      configs.isClose = false; // Set isClose to false when opening modal
      this.modalConfig.next(configs);
      this.configs = configs;
    }
  }

  getModalConfigs = () => this.configs;

  closeModal = () => {
    const closedConfig: ModalConfig = {
      ...this.configs,
      componentRef: null as unknown as Type<any>,
      isClose: true
    };
    this.modalConfig.next(closedConfig);
    this.configs = closedConfig;
  }
}
