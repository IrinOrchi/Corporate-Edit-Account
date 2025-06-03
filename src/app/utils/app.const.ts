import { GlobalConfig } from "ngx-toastr";

export const ToastrConfig: Partial<GlobalConfig> = {
    iconClasses: {
        error: 'err-msg',
        info: 'info-msg',
        success: 'success-msg',
        warning: 'warning-msg'
    },
    closeButton: true
}

export const ModalAttributes = {
    "aria-haspopup": "dialog",
    "aria-expanded": false,
    "aria-controls": "hs-vertically-centered-scrollable-modal",
    "data-hs-overlay": "#hs-vertically-centered-scrollable-modal",
    "id": "hs-large-modal"
}

export const CompanyId = 'CompanyId'
export const UserId = 'UserId'

export const AgeRangeConfig = { floor: 18, ceil: 65, hidePointerLabels: true, hideLimitLabels: true };
export const ExpRangeConfig = { floor: 0, ceil: 50, hidePointerLabels: true, hideLimitLabels: true };
export const SalaryRangeConfig = { floor: 20000, ceil: 100000, hidePointerLabels: true, hideLimitLabels: true };