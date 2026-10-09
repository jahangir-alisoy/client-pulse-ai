import { KeyRound, Lock, Pencil, RefreshCw, Trash2 } from 'lucide-react'
import type { ApiKey } from '../../api/types'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { Skeleton } from '../../components/Skeleton'
import { formatDate, formatDateTime, formatRelative } from '../../lib/format'
import styles from './ApiKeys.module.css'

type ApiKeyListProps = {
  apiKeys: ApiKey[]
  loading: boolean
  limit: number
  onRename: (apiKey: ApiKey) => void
  onRotate: (apiKey: ApiKey) => void
  onDelete: (apiKey: ApiKey) => void
}

const SKELETON_ROWS = 2

export function ApiKeyList({ apiKeys, loading, limit, onRename, onRotate, onDelete }: ApiKeyListProps) {
  return (
    <Card className={styles.listCard}>
      <div className={styles.cardHeader}>
        <div className={styles.cardHeading}>
          <h2 className={styles.cardTitle}>Your keys</h2>
          <p className={styles.cardDescription}>
            <Lock size={12} strokeWidth={2} aria-hidden="true" className={styles.inlineIcon} />
            Only a hash of each key is stored. Secrets are shown once.
          </p>
        </div>
        {!loading && (
          <span className={`${styles.count} tabular`} aria-label={`${apiKeys.length} of ${limit} keys used`}>
            {apiKeys.length} / {limit}
          </span>
        )}
      </div>

      {loading ? (
        <ListSkeleton />
      ) : apiKeys.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon} aria-hidden="true">
            <KeyRound size={20} strokeWidth={1.75} />
          </span>
          <h3 className={styles.emptyTitle}>No API keys yet</h3>
          <p className={styles.emptyText}>Create a key to connect your systems and resume the simulation.</p>
        </div>
      ) : (
        <>
          <div className={`${styles.row} ${styles.columns}`} aria-hidden="true">
            <span>Name</span>
            <span>Key</span>
            <span className={styles.metaColumns}>
              <span>Created</span>
              <span>Last used</span>
              <span>Rotated</span>
            </span>
            <span />
          </div>
          <ul className={styles.keys}>
            {apiKeys.map((apiKey) => (
              <ApiKeyRow key={apiKey.id} apiKey={apiKey} onRename={onRename} onRotate={onRotate} onDelete={onDelete} />
            ))}
          </ul>
        </>
      )}
    </Card>
  )
}

type ApiKeyRowProps = {
  apiKey: ApiKey
  onRename: (apiKey: ApiKey) => void
  onRotate: (apiKey: ApiKey) => void
  onDelete: (apiKey: ApiKey) => void
}

function ApiKeyRow({ apiKey, onRename, onRotate, onDelete }: ApiKeyRowProps) {
  return (
    <li className={`${styles.row} ${styles.key}`}>
      <div className={styles.keyName}>
        <span className={styles.keyIcon} aria-hidden="true">
          <KeyRound size={14} strokeWidth={1.75} />
        </span>
        <h3 className={styles.keyTitle} title={apiKey.name}>
          {apiKey.name}
        </h3>
      </div>
      <div className={styles.keyValueCell}>
        <code className={styles.keyValue} translate="no" aria-label={`Masked key ${apiKey.maskedKey}`}>
          {apiKey.maskedKey}
        </code>
      </div>
      <dl className={styles.meta}>
        <div className={styles.metaItem}>
          <dt>Created</dt>
          <dd className="tabular" title={formatDateTime(apiKey.createdAt)}>
            {formatDate(apiKey.createdAt)}
          </dd>
        </div>
        <div className={styles.metaItem}>
          <dt>Last used</dt>
          <dd className={apiKey.lastUsedAt ? 'tabular' : styles.never} title={apiKey.lastUsedAt ? formatDateTime(apiKey.lastUsedAt) : undefined}>
            {apiKey.lastUsedAt ? formatRelative(apiKey.lastUsedAt) : 'Never'}
          </dd>
        </div>
        <div className={styles.metaItem}>
          <dt>Rotated</dt>
          <dd className={apiKey.rotatedAt ? 'tabular' : styles.never} title={apiKey.rotatedAt ? formatDateTime(apiKey.rotatedAt) : undefined}>
            {apiKey.rotatedAt ? formatDate(apiKey.rotatedAt) : 'Never'}
          </dd>
        </div>
      </dl>
      <div className={styles.actions}>
        <Button variant="ghost" size="small" className={styles.action} title="Rename" aria-label={`Rename ${apiKey.name}`} onClick={() => onRename(apiKey)}>
          <Pencil size={14} strokeWidth={1.75} aria-hidden="true" />
          <span className={styles.actionLabel}>Rename</span>
        </Button>
        <Button variant="ghost" size="small" className={styles.action} title="Rotate secret" aria-label={`Rotate ${apiKey.name}`} onClick={() => onRotate(apiKey)}>
          <RefreshCw size={14} strokeWidth={1.75} aria-hidden="true" />
          <span className={styles.actionLabel}>Rotate</span>
        </Button>
        <Button
          variant="ghost"
          size="small"
          className={`${styles.action} ${styles.deleteAction}`}
          title="Delete"
          aria-label={`Delete ${apiKey.name}`}
          onClick={() => onDelete(apiKey)}
        >
          <Trash2 size={14} strokeWidth={1.75} aria-hidden="true" />
          <span className={styles.actionLabel}>Delete</span>
        </Button>
      </div>
    </li>
  )
}

function ListSkeleton() {
  return (
    <ul className={styles.keys} aria-busy="true" aria-label="Loading API keys">
      {Array.from({ length: SKELETON_ROWS }, (_, index) => (
        <li key={index} className={`${styles.row} ${styles.skeletonRow}`}>
          <Skeleton width={140} height={14} />
          <Skeleton width={170} height={22} radius={6} />
          <Skeleton width="80%" height={12} />
          <Skeleton width={96} height={12} className={styles.skeletonActions} />
        </li>
      ))}
    </ul>
  )
}
