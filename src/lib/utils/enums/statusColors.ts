export const StatusColors = {
  ACTIVE: "bg-green-500 text-white hover:bg-green-600",
  SUCCESS: "bg-green-500 text-white hover:bg-green-600",
  INACTIVE: "bg-gray-500 text-white hover:bg-gray-600",
  DEFAULT: "bg-gray-500 text-white hover:bg-gray-600",
  SECONDARY: "bg-gray-500 text-white hover:bg-gray-600",
  EXPIRED: "bg-red-500 text-white hover:bg-red-600",
  DELETED: "bg-red-500 text-white hover:bg-red-600",
  ERROR: "bg-red-500 text-white hover:bg-red-600",
  LOCKED: "bg-red-500 text-white hover:bg-red-600",
  HIDDEN: "bg-yellow-500 text-white hover:bg-yellow-600",
  WARNING: "bg-yellow-500 text-white hover:bg-yellow-600"
} as const;
export const getStatusColor = (status: number): string => {
  switch (status) {
    case 0:
      return StatusColors.INACTIVE;
    case 1:
      return StatusColors.ACTIVE;
    case 2:
      return StatusColors.EXPIRED;
    case 3:
      return StatusColors.HIDDEN;
    default:
      return StatusColors.DEFAULT;
  }
};
export const StatusBadgeVariants = {
  ACTIVE: StatusColors.ACTIVE,
  INACTIVE: StatusColors.INACTIVE,
  EXPIRED: StatusColors.EXPIRED,
  DELETED: StatusColors.DELETED,
  HIDDEN: StatusColors.HIDDEN,
  LOCKED: StatusColors.LOCKED
} as const;