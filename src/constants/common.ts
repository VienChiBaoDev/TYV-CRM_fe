export const FOLLOW_UP_SCHEDULE_STATUS = {
  1: {
    name: "Đã đặt lịch",
    className: "text-emerald-700",
  },
  2: {
    name: "Chưa đặt lịch",
    className: "text-orange-500",
  },
}

export const CLINICAL_ASSESSMENT_SCALE_RESULT = {
  1: {
    value: 1,
    name: "Tiến triển tốt",
    className: "text-emerald-700",
  },
  2: {
    value: 2,
    name: "Bình thường",
    className: "text-blue-500",
  },
  3: {
    value: 3,
    name: "Cần hội chẩn",
    className: "text-orange-500",
  },
  4: {
    value: 4,
    name: "Tiến triển tốt",
    className: "text-green-700",
  },
  5: {
    value: 5,
    name: "Hủy lịch",
    className: "text-red-500",
  },
}

export const MODAL_CUSTOMER_MODE = {
  ADD: "add",
  EDIT: "edit",
}

export type ModalCustomerModeType =
  (typeof MODAL_CUSTOMER_MODE)[keyof typeof MODAL_CUSTOMER_MODE]
