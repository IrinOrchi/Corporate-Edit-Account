import { Type } from '@angular/core';

export interface SelectItem {
  label: string;
  value: any;
  isSelected?: boolean;
  selectId?: string;
  mainObj?: any;
  icon?: string;
  count?: number;
}

export interface MultiSelectQueryEvent {
  originalEvent?: Event;
  query: string;
}

export interface BaseObject {
  id: number;
  name: string;
}

export interface Locality extends BaseObject {
  isOutsideBangladesh: number;
  parentLocationId: number;
}

export interface ActiveFiltersBadges {
  controlType: string;
  value: any;
  isActive: boolean;
}

export interface SelectRadioData {
  id: number | string | boolean;
  name: string;
  label: string;
}

export interface Pagination {
  pageNo: number;
  pageSize: number;
  total?: number;
}

export interface CustomSelectData {
  venueId: string;
  vanueName: string;
  venueAddress: string;
}

export interface Venue {
  venueID: number;
  venueName: string;
  venueAddress: string;
}

export interface VenueParams {
  companyID: number;
  userID: number;
}

export interface VanueEditUpdateRequest{
  companyId: string;
  userId: string;
  venueName: string;
  venueAddress: string;
  venueId: number;
}

export interface ModalConfig {
  attributes: Record<string, string | boolean>;
  componentRef: Type<any>;
  inputs?: Record<string, any>;
  isClose?: boolean;
}

export type TooltipTag = 'h1' | 'h2' | 'h3' | 'p' | 'span'