import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { AppShell } from '@/components/layout';
import { Card, Badge, Button } from '@/design-system';
import { StatusBadge, AlertFeed, UnitDonut, TempTrend } from '@/components/common';
import { useSiteDetail } from '@/hooks/useSiteDetail';
import styles from './SiteDetailPage.module.css';

interface Crumb {
  label: string;
  href: string;
}

// The origin (e.g. the search results page) is passed via navigation state so
// the breadcrumb and back action can return there instead of always to Sites.
function readOrigin(state: unknown): Crumb | null {
  if (state && typeof state === 'object' && 'from' in state) {
    const from = (state as { from: unknown }).from;
    if (from && typeof from === 'object' && 'label' in from && 'href' in from) {
      const { label, href } = from as { label: unknown; href: unknown };
      if (typeof label === 'string' && typeof href === 'string') return { label, href };
    }
  }
  return null;
}

function SectionTitle({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className={styles.sectionTitle}>
      <h2 className={styles.sectionTitleText}>{children}</h2>
      {right}
    </div>
  );
}

function InfoRow({ label, children, last }: { label: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className={last ? styles.infoRowLast : styles.infoRow}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>{children}</span>
    </div>
  );
}

export function SiteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { site, isLoading, error } = useSiteDetail(id ?? '');

  const origin = readOrigin(state);
  const backCrumb: Crumb = origin ?? { label: t('nav.sites'), href: '/' };

  const backAction = (
    <Button hierarchy="secondaryGray" onClick={() => navigate(backCrumb.href)}>
      <ArrowLeft size={16} />
      {origin ? t('siteDetail.back') : t('siteDetail.backToSites')}
    </Button>
  );

  if (isLoading) {
    return (
      <AppShell title={t('siteDetail.loading')} breadcrumb={backCrumb} actions={backAction}>
        <div className={styles.loadingWrap}>
          <div className={`hvac-skel ${styles.skel}`} />
        </div>
      </AppShell>
    );
  }

  if (error || !site) {
    return (
      <AppShell title={t('siteDetail.notFoundTitle')} breadcrumb={backCrumb} actions={backAction}>
        <div className={styles.errorWrap}>
          <p className={styles.errorText}>
            {t('siteDetail.notFound')}
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title={site.name}
      subtitle={`${site.customer} · ${site.city}`}
      breadcrumb={backCrumb}
      actions={backAction}
    >
      <div className={styles.layout}>
        {/* Site Information */}
        <Card padding={24}>
          <SectionTitle>{t('siteDetail.siteInformation')}</SectionTitle>
          <InfoRow label={t('siteDetail.siteName')}>{site.name}</InfoRow>
          <InfoRow label={t('siteDetail.customer')}>{site.customer}</InfoRow>
          <InfoRow label={t('siteDetail.status')} last>
            <StatusBadge status={site.status} size="sm" />
          </InfoRow>
        </Card>

        {/* Unit Summary */}
        <Card padding={24}>
          <SectionTitle
            right={
              <span className={styles.secondaryText}>
                {t('siteDetail.unitsTotal', { value: site.units })}
              </span>
            }
          >
            {t('siteDetail.unitSummary')}
          </SectionTitle>
          <UnitDonut indoor={site.indoor} outdoor={site.outdoor} controllers={site.controllers} />
        </Card>

        {/* Temperature Trend */}
        <Card padding={24} className={styles.fullWidth}>
          <SectionTitle
            right={
              site.trend != null && (
                <span className={styles.secondaryText}>
                  {t('siteDetail.setpoint', { value: site.setpoint })}
                </span>
              )
            }
          >
            {t('siteDetail.temperatureLast24h')}
          </SectionTitle>
          <TempTrend data={site.trend ?? []} setpoint={site.setpoint} />
        </Card>

        {/* Recent Alerts */}
        <Card padding={24} className={styles.fullWidth}>
          <SectionTitle
            right={
              <Badge color="gray" size="sm">
                {site.alertList.length}
              </Badge>
            }
          >
            {t('siteDetail.recentAlerts')}
          </SectionTitle>
          <AlertFeed
            items={site.alertList}
            emptyTitle={t('siteDetail.noRecentAlertsTitle')}
            emptyDescription={t('siteDetail.noRecentAlertsDescription')}
          />
        </Card>
      </div>
    </AppShell>
  );
}
