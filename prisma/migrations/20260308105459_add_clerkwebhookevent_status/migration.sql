-- RenameIndex
ALTER INDEX "AvailabilityRule_tenantId_dayOfWeek_deletedAt_window_idx" RENAME TO "AvailabilityRule_tenantId_dayOfWeek_deletedAt_startTime_end_idx";

-- RenameIndex
ALTER INDEX "Booking_tenantId_deletedAt_time_window_idx" RENAME TO "Booking_tenantId_deletedAt_startTime_endTime_idx";

-- RenameIndex
ALTER INDEX "VisualizerPreview_tenant_wrap_deleted_expiry_created_idx" RENAME TO "VisualizerPreview_tenantId_wrapId_deletedAt_expiresAt_creat_idx";
