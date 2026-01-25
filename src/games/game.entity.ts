import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity({ name: 'games' })
  export class Game {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
  
    @Column({ type: 'text' })
    title!: string;
  
    @Column({ type: 'text' })
    genre!: string;
  
    @Column({ type: 'int' })
    price!: number;
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    created_at!: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updated_at!: Date;
  }
  