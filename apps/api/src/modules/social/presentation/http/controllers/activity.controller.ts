import { ListActivityQuery } from '@modules/social/application/queries/list-activity';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ListActivityDTO } from '../dtos/list-activity.dto';
import { ActivityListPresenter } from '../presenters/activity-list.presenter';

@ApiTags('Activity')
@ApiBearerAuth()
@Controller('social/profiles')
export class ActivityController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':profileId/activity')
  @ApiOperation({ summary: 'List activity for a profile (most recent first)' })
  @ApiParam({ name: 'profileId', description: 'Profile ID' })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description: 'Cursor for pagination',
  })
  @ApiQuery({
    name: 'take',
    required: false,
    description: 'Number of items to return (1-50, default 10)',
  })
  @ApiOkResponse({ description: 'Activity list' })
  async listActivity(
    @Param('profileId') profileId: string,
    @Query() query: ListActivityDTO,
  ) {
    const result = await this.queryBus.execute(
      new ListActivityQuery(profileId, query.cursor, query.take),
    );

    if (result.isErr()) {
      throw result.unwrapErr();
    }

    const presenter = new ActivityListPresenter();

    return presenter.present(result.unwrap());
  }
}
