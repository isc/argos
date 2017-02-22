import { factory } from 'factory-girl'
import ObjectionAdapter from 'server/test/ObjectionAdapter'
import Build from 'server/models/Build'
import Organization from 'server/models/Organization'
import Repository from 'server/models/Repository'
import Screenshot from 'server/models/Screenshot'
import ScreenshotBucket from 'server/models/ScreenshotBucket'
import ScreenshotDiff from 'server/models/ScreenshotDiff'
import Synchronization from 'server/models/Synchronization'
import User from 'server/models/User'
import UserRepositoryRight from 'server/models/UserRepositoryRight'

factory.setAdapter(new ObjectionAdapter())

factory.define('ScreenshotBucket', ScreenshotBucket, {
  name: factory.sequence('repository.name', n => `bucket-${n}`),
  commit: '4342ce965368d3281bb59a4a49f5486acda23eae',
  branch: 'master',
  repositoryId: factory.assoc('Repository', 'id'),
})

factory.define('Build', Build, {
  repositoryId: factory.assoc('Repository', 'id'),
}, {
  async afterBuild(model, attrs) {
    if (!attrs.compareScreenshotBucketId) {
      const compareScreenshotBucket = await factory.create('ScreenshotBucket', {
        repositoryId: model.repositoryId || attrs.repositoryId,
      })
      model.compareScreenshotBucketId = compareScreenshotBucket.id
    } else {
      model.compareScreenshotBucketId = attrs.compareScreenshotBucketId
    }

    return model
  },
})

factory.define('User', User, {
  githubId: factory.sequence('user.githubId', n => n),
  name: factory.chance('name'),
  email: factory.sequence('user.email', n => `user-${n}@email.com`),
})

factory.define('Organization', Organization, {
  githubId: factory.sequence('organization.githubId', n => n),
  name: factory.chance('name'),
})

factory.define('Repository', Repository, {
  githubId: factory.sequence('repository.githubId', n => n),
  name: factory.sequence('repository.name', n => `repo-${n}`),
  enabled: true,
  organizationId: factory.assoc('Organization', 'id'),
})

factory.define('UserRepositoryRight', UserRepositoryRight, {
  userId: factory.assoc('User', 'id'),
  repositoryId: factory.assoc('Repository', 'id'),
})

factory.define('ScreenshotDiff', ScreenshotDiff, {
  buildId: factory.assoc('Build', 'id'),
  baseScreenshotId: factory.assoc('Screenshot', 'id'),
  compareScreenshotId: factory.assoc('Screenshot', 'id'),
  jobStatus: 'success',
  validationStatus: 'accepted',
})

factory.define('Screenshot', Screenshot, {
  name: factory.sequence('repository.name', n => `screen-${n}`),
  s3Id: 'test-s3-id',
  screenshotBucketId: factory.assoc('ScreenshotBucket', 'id'),
})

factory.define('Synchronization', Synchronization, {
  userId: factory.assoc('User', 'id'),
  jobStatus: 'success',
  type: 'github',
})

export default factory