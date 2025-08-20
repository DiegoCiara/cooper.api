import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createAgent1631039612323 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'agents',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'instructions',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'temperature',
            type: 'enum',
            enum: ['PERSONAL', 'BUSINESS'],
            default: `'PERSONAL'`,
          },
          {
            name: 'picture',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'subscription_id',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'session_id',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'openai_assistant_id',
            type: 'varchar',
          },
          {
            name: 'waiting_time',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'session_token',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'metadata',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'user',
            type: 'uuid',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      })
    );
    await queryRunner.createForeignKey(
      'agents',
      new TableForeignKey({
        columnNames: ['user'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('agents');
  }
}

